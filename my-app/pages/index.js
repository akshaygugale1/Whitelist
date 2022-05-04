import Head from "next/head";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { providers, Contract } from "ethers";
import styles from "../styles/Home.module.css";
import Web3Modal from "web3modal";
import { ABI, CONTRACT_ADDRESS } from "./../constants/index";

export default function Home() {
  const [noOfWhitelistedAddress, setNoOfWhitelistedAddress] = useState(0);
  const [walletConnected, setWalletConnected] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);
  const [loading, setLoading] = useState(false);
  const web3ModalRef = useRef();

  const connectWallet = async () => {
    try {
      await getProviderOrSigner();
      setWalletConnected(true);
      checkIfAddressInWhitelist();
      getNumberOfWhitelisted();
    } catch (err) {
      console.log(err);
    }
  };

  const getProviderOrSigner = async (needSigner = false) => {
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);

    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 4) {
      window.alert("Change the network to Rinkeby");
      throw new Error("Change network to Rinkeby");
    }
    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }
    return web3Provider;
  };

  const checkIfAddressInWhitelist = async () => {
    try {
      const signer = await getProviderOrSigner(true);
      const whitelistContract = new Contract(CONTRACT_ADDRESS, ABI, signer);
      const address = await signer.getAddress();
      const _hasJoined = await whitelistContract.whitelistedAddresses(address);
      setHasJoined(_hasJoined);
    } catch (err) {
      console.log(err);
    }
  };

  const getNumberOfWhitelisted = async () => {
    try {
      const signer = await getProviderOrSigner(true);
      const whitelistContract = new Contract(CONTRACT_ADDRESS, ABI, signer);
      const _noOfWhitelistedAddress =
        await whitelistContract.numAddressesWhitelisted();
      setNoOfWhitelistedAddress(_noOfWhitelistedAddress);
    } catch (err) {
      console.log(err);
    }
  };

  const addAdressToWhitelist = async () => {
    try {
      const provider = await getProviderOrSigner(true);
      const whitelistContract = new Contract(CONTRACT_ADDRESS, ABI, provider);

      const tx = await whitelistContract.addAddressToWhitelist();
      setLoading(true);
      await tx.wait();
      setLoading(false);
      await getNumberOfWhitelisted();
      setHasJoined(true);
    } catch (err) {
      console.log(err);
    }
  };
  const renderButton = () => {
    if (walletConnected) {
      if (hasJoined) {
        return (
          <div className={styles.description}>
            Thank you for joining WhiteList
          </div>
        );
      } else if (loading) {
        return <button className={styles.button}>Loading...</button>;
      } else {
        return (
          <button className={styles.button} onClick={addAdressToWhitelist}>
            Click To Join WhiteList
          </button>
        );
      }
    } else {
      return (
        <button className={styles.button} onClick={connectWallet}>
          Connect Wallet
        </button>
      );
    }
  };
  useEffect(() => {
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "rinkeby",
        providerOptions: {},
        disableInjcetedProvider: false,
      });
      connectWallet();
    }
  }, [walletConnected]);
  return (
    <div>
      <Head>
        <title>Whitelist Dapp</title>
        <meta name="description" content="Whitelist-Dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>Welcome to Crypto Devs!</h1>
          <div className={styles.description}>
            Its an NFT collection for developers in Crypto.
          </div>
          <div className={styles.description}>
            {noOfWhitelistedAddress} have already joined the Whitelist
          </div>
          {renderButton()}
        </div>
        <div>
          <img className={styles.image} src="./crypto-devs.svg" />
        </div>
      </div>

      <footer className={styles.footer}>Made with &#10084; by Akshay G</footer>
    </div>
  );
}
