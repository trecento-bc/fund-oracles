const Web3 = require('web3')
const LocalProvider = require('web3-local-signing-provider')

const networks = require('./eth-networks')

let web3

const deployedContractInstances = {}
const contractJsons = {}

const getWeb3 = async function (net, pk) {
  if (!web3) {
    pk = pk || global.privateKey
    net = net || global.ethNetwork

    pk = pk.split(',')

    if (!net.url && !networks[net]) {
      throw new Error('unknown network')
    }

    let network = {}

    if (net.url) {
      network = {
        id: '*',
        addr: net.url
      }
    } else {
      network = networks[net]
    }
    const netProvider = new Web3.providers.HttpProvider(network.addr)

    const localProvider = new LocalProvider(pk, netProvider)
    web3 = localProvider.web3
  }
  return web3
}

const getContractJson = function (name) {
  if (contractJsons[name]) {
    return contractJsons[name]
  }
  try {
    contractJsons[name] = require(global.filePath + '/../contracts_api/' + name)
    return contractJsons[name]
  } catch (err) {
    return undefined
  }
}

const isContract = async function (address) {
  try {
    let code = await web3.eth.getCode(address)
    return code !== '0x0'
  } catch (err) {
    return false
  }
}

const getDeployedInstance = async function (name, address) {
  if (deployedContractInstances[name]) {
    return deployedContractInstances[name]
  }

  const json = getContractJson(name)
  const w3 = await getWeb3()
  const netId = await w3.eth.net.getId()
  const isContractDeployed = json && json.networks[netId] &&
    (await isContract(address || json.networks[netId].address))
  if (isContractDeployed) {
    const contract = new w3.eth.Contract(json.abi, address || json.networks[netId].address, {
      from: w3.eth.defaultAccount
    })
    deployedContractInstances[name] = contract
    return contract
  }
  return undefined
}

const getContractInstance = async function (name, address) {
  let w3 = await getWeb3()
  let json = getContractJson(name)
  return new w3.eth.Contract(json.abi, address, {
    from: w3.eth.defaultAccount
  })
}

const deployNewInstance = async function (name, contractArguments) {
  let json = getContractJson(name)
  let contract = await getContractInstance(name)
  let receipt = await contract.deploy({
    arguments: contractArguments,
    data: (json.linkedBytecode || json.bytecode)
  }).send({ gas: 5000000 })

  contract.options.address = receipt.contractAddress
  deployedContractInstances[name] = contract

  return contract
}

const linkLibrary = async function (libJsonName, contract) {
  let libJson = await getContractJson(libJsonName)
  let lib = await getDeployedInstance(libJsonName)
  if (!lib) {
    lib = await deployNewInstance(libJsonName)
  }

  let libName = '__' + libJson.contractName + ('_').repeat(40)
  const json = getContractJson(contract)
  let linkedBytecode = json.bytecode.replace(new RegExp(libName.substr(0, 40), 'g'),
    lib.options.address.substr(2))

  json.linkedBytecode = linkedBytecode
  contractJsons[contract] = json
  return json
}

export {
  getWeb3,
  getContractJson,
  linkLibrary,
  deployNewInstance,
  getDeployedInstance
}
