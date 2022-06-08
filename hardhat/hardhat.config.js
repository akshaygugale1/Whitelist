require("@nomiclabs/hardhat-waffle");
require("dotenv").config({ path: ".env" });

const ALCHEMY_RINKEBY_API_KEY_URL = process.env.ALCHEMY_RINKEBY_URL;
const ALCHEMY_MUMBAI_API_KEY_URL = process.env.ALCHEMY_MUMBAI_URL;

const PRIVATE_KEY = process.env.ACCOOUNT;
module.exports = {
  solidity: "0.8.4",
  networks: {
    rinkeby: {
      url: ALCHEMY_RINKEBY_API_KEY_URL,
      accounts: [PRIVATE_KEY],
    },
    mumbai: {
      url: ALCHEMY_MUMBAI_API_KEY_URL,
      accounts: [PRIVATE_KEY],
    },
  },
};
