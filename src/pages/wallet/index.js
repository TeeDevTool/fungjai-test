import { useEffect, useState } from "react";
import { balance, withdraw as sendWithdraw } from "../../services/Web3Clients";
import { star } from "../../configs/static";
import { primary, secondary } from "../../colors/color";
import Button from "../../components/Button";

const WithdrawBox = ({ getAmount, handleCancel, handleWithdraw }) => {
  const [earn, setEarn] = useState({ amount: 0, sendComplete: false });

  const setEarns = (amount) => {
    setEarn((getEarn) => ({
      ...getEarn,
      amount,
      sendComplete: amount === 0 ? false : true,
    }));
  };

  return (
    <div className="post">
      <h4>Amount</h4>
      <input
        type="number"
        onChange={(e) => getAmount(e)}
        style={{ textAlign: "left", marginRight: 15 }}
        className="input"
      />
      <Button onClick={() => handleWithdraw(setEarns)} red>
        Confirm
      </Button>
      <Button onClick={handleCancel}>Cancel</Button>
      {earn.sendComplete && (
        <div
          style={{ margin: 10, color: secondary }}
        >{`You earn ${earn.amount} tokens`}</div>
      )}
    </div>
  );
};

const Wallet = ({ setRoute }) => {
  const [wallet, setWallet] = useState(0);
  const [withdraw, setWithdraw] = useState({
    isOpen: false,
    amount: 0,
    forceRender: false,
  });

  useEffect(() => {
    const getBalance = async () => {
      const balances = await balance();
      setWallet(balances);
    };

    getBalance();
  }, [withdraw.forceRender]);

  const getAmount = ({ target }) => {
    setWithdraw((state) => ({
      ...state,
      amount: target.value > 10000 ? 10000 : target.value,
    }));
  };

  const handleWithdraw = async (setEarn) => {
    let earn = (withdraw.amount * star * 9) / 10;
    const response = await sendWithdraw(withdraw.amount * star);
    if (response) {
      setWithdraw((state) => ({ ...state, forceRender: !state.forceRender }));
      setEarn(earn);

      setTimeout(() => {
        setEarn(0);
      }, 4000);
    }
  };

  return (
    <div className="box">
      <div className="fullwidth" style={{ textAlign: "left" }}>
        <Button onClick={() => setRoute("feed")}>Back</Button>
      </div>
      <h1
        style={{
          width: "100%",
          textAlign: "center",
        }}
      >
        WALLET
      </h1>
      <h1
        style={{
          fontStyle: "italic",
          color: primary,
          width: "100%",
          textAlign: "center",
        }}
      >
        {Math.floor(wallet / star)}
      </h1>
      <h1
        style={{
          fontStyle: "italic",
          width: "100%",
          textAlign: "center",
        }}
      >
        Stars
      </h1>
      {withdraw.isOpen ? (
        <WithdrawBox
          getAmount={getAmount}
          handleWithdraw={handleWithdraw}
          handleCancel={() =>
            setWithdraw((state) => ({ ...state, isOpen: false, amount: 0 }))
          }
        />
      ) : (
        <Button
          onClick={() => setWithdraw((state) => ({ ...state, isOpen: true }))}
          red
          fullwidth
        >
          Withdraw
        </Button>
      )}
      <div
        style={{
          fontStyle: "italic",
          color: primary,
          width: "100%",
          textAlign: "center",
        }}
      >
        *** Policy : 1 star = 10^10 tokens, for withdraw we'll take 10% fees
        from amount.
      </div>
    </div>
  );
};

export default Wallet;
