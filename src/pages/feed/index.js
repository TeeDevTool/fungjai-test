import { useEffect, useState } from "react";
import { primary, secondary } from "../../colors/color";
import Button from "../../components/Button";
import { feed, post as sendPost, donate } from "../../services/Web3Clients";
import { star } from "../../configs/static";

const Feed = ({ row, current }) => {
  const [donates, setDonate] = useState({
    amount: 0,
    isDonate: false,
    completed: false,
  });
  const [owner, caption, address] = row;
  const isOwner = owner === current;

  const setDonater = (state) => setDonate(state);

  return (
    <div style={{ textAlign: "left" }} className="post">
      <div
        style={{
          fontSize: 20,
          fontWeight: 600,
          color: primary,
          marginBottom: 10,
        }}
      >
        {owner}
      </div>
      <div
        style={{
          marginBottom: !isOwner ? 10 : 0,
        }}
      >
        {caption}
      </div>
      {!isOwner ? (
        donates.isDonate ? (
          <Donate setDonater={setDonater} to={address} {...donates} />
        ) : (
          <Button
            onClick={() => setDonate((state) => ({ ...state, isDonate: true }))}
            red
          >
            You like this? Donate!!
          </Button>
        )
      ) : null}
    </div>
  );
};

const Donate = ({ setDonater, amount, completed, to }) => {
  const handleDonate = async () => {
    const response = await donate(to, amount * star);
    if (response) {
      setDonater((state) => ({ ...state, completed: true }));

      setTimeout(() => {
        setDonater((state) => ({ ...state, amount: 0, completed: false }));
      }, 4000);
    }
  };

  return (
    <div className="post">
      <h4>Donate</h4>
      <input
        type="number"
        style={{ textAlign: "left", marginRight: 15 }}
        className="input"
        onChange={({ target }) =>
          setDonater((state) => ({ ...state, amount: target.value }))
        }
      />
      <div style={{ marginTop: 15 }}>
        <Button onClick={() => handleDonate()} red>
          Confirm
        </Button>
        <Button
          onClick={() =>
            setDonater((state) => ({ ...state, isDonate: false, amount: 0 }))
          }
        >
          Cancel
        </Button>
      </div>
      {completed && (
        <div
          style={{ color: secondary, margin: 10 }}
        >{`You have donate ${amount} stars!!`}</div>
      )}
    </div>
  );
};

const Post = ({ setCaption, handlePost }) => {
  return (
    <div style={{ textAlign: "left" }} className="post">
      <div
        style={{
          fontSize: 20,
          fontWeight: 500,
          color: primary,
          marginBottom: 10,
        }}
      >
        Pls, tell us what you thinking?
      </div>
      <input
        style={{
          maxWidth: 600,
          margin: "auto",
          marginBottom: 10,
          textAlign: "left",
        }}
        className="input fullwidth"
        onChange={(e) => setCaption(e)}
      />
      <Button onClick={() => handlePost()} red>
        Post!
      </Button>
    </div>
  );
};

const Feeds = ({ account, setRoute }) => {
  const [renderFeed, setFeed] = useState([]);
  const [post, setPost] = useState({
    isOpen: false,
    caption: "",
    forceReload: false,
  });

  useEffect(() => {
    const getFeed = async () => {
      const feeds = await feed();
      setFeed(feeds);
    };

    getFeed();
  }, [post.forceReload]);

  const setCaption = ({ target }) => {
    setPost((currentState) => ({
      ...currentState,
      caption: target.value,
    }));
  };

  const handledPost = async () => {
    const response = await sendPost(account.name, post.caption);
    if (response) {
      setPost((currentState) => ({
        ...currentState,
        caption: "target.value",
        isOpen: false,
        forceReload: !post.forceReload,
      }));
    }
  };

  return (
    <div className="box">
      <h2 style={{ color: primary }}>{`Current user : ${account.name}`}</h2>
      <div>
        <Button
          onClick={() =>
            setPost((currentState) => ({
              ...currentState,
              isOpen: !post.isOpen,
            }))
          }
          red
        >
          Post
        </Button>
        <Button onClick={() => setRoute("wallet")}>Balance</Button>
      </div>
      {post.isOpen ? (
        <Post setCaption={setCaption} handlePost={handledPost} />
      ) : (
        renderFeed.map((row, index) => (
          <Feed key={index} current={account.name} row={row} />
        ))
      )}
    </div>
  );
};

export default Feeds;
