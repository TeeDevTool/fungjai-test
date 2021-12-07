// external modules
import { useEffect, useState } from "react";

import Register from "./pages/register";
import Wallet from "./pages/wallet";
import Feed from "./pages/feed";
import { getAccountName } from "./services/Web3Clients";
import "./styles.css";

const Router = ({ route, ...other }) => {
  switch (route) {
    case "feed":
      return <Feed {...other} />;
    case "register":
      return <Register {...other} />;
    case "wallet":
      return <Wallet {...other} />;
    default:
      return null;
  }
};

export default function App() {
  const [route, setRoute] = useState("feed");
  const [account, setAccount] = useState({ address: "", name: "" });

  // tracking on account
  window.ethereum.on("accountsChanged", (accounts) => {
    setAccount((currentAccount) => ({
      ...currentAccount,
      address: accounts[0],
      name: "",
    }));
  });

  useEffect(() => {
    const getName = async () => {
      const name = await getAccountName();
      if (name === "") {
        return setRoute("register");
      }
      setRoute("feed");
      return setAccount((currentAccount) => ({ ...currentAccount, name }));
    };

    getName();
  }, [account.address]);

  const innerSetRoute = (path) => setRoute(path);

  return (
    <div className="App">
      <Router setRoute={innerSetRoute} account={account} route={route} />
    </div>
  );
}
