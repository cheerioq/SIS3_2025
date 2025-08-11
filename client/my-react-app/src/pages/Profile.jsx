import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import defaultpfp from "../defaultpfp.jpg";

import btcIcon from "../btc.png";
import ethIcon from "../eth.png";
import solIcon from "../sol.png";
import bnbIcon from "../bnb.png";

function Profile({ loggedInUserId, accessToken }) {
  const { id } = useParams();

  const [userInfo, setUserInfo] = useState({
    username: "",
    createdAt: "",
    updatedAt: "",
  });
  const [posts, setPosts] = useState([]);
  const [userCoins, setUserCoins] = useState([]);

  const availableCoins = [
    { id: "bitcoin", symbol: "BTC", name: "Bitcoin", icon: btcIcon },
    { id: "ethereum", symbol: "ETH", name: "Ethereum", icon: ethIcon },
    { id: "solana", symbol: "SOL", name: "Solana", icon: solIcon },
    { id: "binancecoin", symbol: "BNB", name: "Binance Coin", icon: bnbIcon },
  ];


  const isOwner = String(id) === String(loggedInUserId);
  console.log("URL id:", id, "Logged in user id:", loggedInUserId, "isOwner:", isOwner);

  useEffect(() => {
    axios
      .get(`http://localhost:2222/auth/basicinfo/${id}`)
      .then((res) => {
        const { username, createdAt, updatedAt } = res.data;
        setUserInfo({ username, createdAt, updatedAt });
      })
      .catch((err) => console.error("Error fetching user info:", err));

    axios
      .get(`http://localhost:2222/posts/byuserId/${id}`)
      .then((res) => setPosts(res.data))
      .catch((err) => console.error("Error fetching user's posts:", err));

    if (isOwner) {
      axios
        .get(`http://localhost:2222/auth/coins`, {
          headers: { accessToken },
        })
        .then((res) => {
          setUserCoins(res.data.coinsOwned || []);
        })
        .catch((err) => {
          console.error("Error fetching own coins:", err);
          setUserCoins([]);
        });
    } else {
      axios
        .get(`http://localhost:2222/auth/coins/${id}`)
        .then((res) => {
          setUserCoins(res.data.coinsOwned || []);
        })
        .catch((err) => {
          console.error("Error fetching other's coins:", err);
          setUserCoins([]);
        });
    }
  }, [id, accessToken, isOwner]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const toggleCoin = (coinId) => {
    if (!isOwner) return; 

    let updatedCoins;
    if (userCoins.includes(coinId)) {
      updatedCoins = userCoins.filter((c) => c !== coinId);
    } else {
      updatedCoins = [...userCoins, coinId];
    }

    setUserCoins(updatedCoins);

    axios
      .post(
        `http://localhost:2222/auth/coins`,
        { coinsOwned: updatedCoins },
        { headers: { accessToken } }
      )
      .catch((err) => console.error("Error saving coins:", err));
  };

  return (
    <div
      style={{
        marginTop: 120,
        display: "flex",
        gap: 40,
        padding: "0 20px",
        justifyContent: "center",
        alignItems: "flex-start",
        fontFamily: "'Arial', sans-serif",
        color: "#a74574",
        minHeight: "calc(100vh - 120px)",
        background: "transparent",
      }}
    >
      {/* Profile Card */}
      <aside
        style={{
          width: 380,
          background:
            "linear-gradient(180deg, rgba(255, 255, 255, 0.85), rgba(255, 148, 211, 0.3))",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          borderRadius: 20,
          boxShadow: "0 8px 20px rgba(255, 148, 211, 0.3)",
          padding: 30,
          position: "sticky",
          top: 120,
          height: "fit-content",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 25,
            alignItems: "center",
            marginBottom: 25,
          }}
        >
          <img
            src={defaultpfp}
            alt="Profile"
            style={{
              width: 120,
              height: 120,
              borderRadius: "50%",
              border: "4px solid #ff94d3",
              boxShadow: "0 0 12px #ff94d3",
              objectFit: "cover",
              flexShrink: 0,
            }}
          />
          <div>
            <h1
              style={{
                fontSize: 24,
                fontWeight: "bold",
                marginBottom: 10,
                color: "#ff4da6",
              }}
            >
              {userInfo.username || "Loading..."}
            </h1>
            <p style={{ margin: "6px 0" }}>
              <strong>Username:</strong> {userInfo.username}
            </p>
            <p style={{ margin: "6px 0" }}>
              <strong>Account Created:</strong>{" "}
              {userInfo.createdAt ? formatDate(userInfo.createdAt) : "Loading..."}
            </p>
            <p style={{ margin: "6px 0" }}>
              <strong>Last Updated:</strong>{" "}
              {userInfo.updatedAt ? formatDate(userInfo.updatedAt) : "Loading..."}
            </p>
          </div>
        </div>

        {/* Coin selector with icons */}
        <div
          style={{
            marginTop: 40,
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            gap: 15,
            maxWidth: "100%",
          }}
        >
          {availableCoins.map((coin) => {
            const isSelected = userCoins.includes(coin.id);
            return (
              <div
                key={coin.id}
                onClick={isOwner ? () => toggleCoin(coin.id) : undefined}
                title={coin.name}
                style={{
                  filter: isSelected
                    ? "none"
                    : "grayscale(100%) brightness(150%) opacity(0.3)",
                  transition: "filter 0.3s ease",
                  width: 60,
                  height: 60,
                  borderRadius: "50%",
                  padding: 8,
                  background: isSelected ? "rgba(255, 77, 166, 0.2)" : "transparent",
                  boxShadow: isSelected ? "0 0 12px #ff4da6" : "none",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: isOwner ? "pointer" : "default",
                  pointerEvents: isOwner ? "auto" : "none",
                }}
              >
                <img
                  src={coin.icon}
                  alt={coin.symbol}
                  style={{
                    width: 44,
                    height: 44,
                    filter: isSelected ? "drop-shadow(0 0 4px #ff4da6)" : "none",
                  }}
                />
              </div>
            );
          })}
        </div>
      </aside>

      {/* Posts Grid */}
      <section
        style={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: 30,
          maxWidth: 1100,
        }}
      >
        {posts.length === 0 ? (
          <p
            style={{
              gridColumn: "1 / -1",
              textAlign: "center",
              fontSize: 18,
              color: "#c2789e",
            }}
          >
            No posts yet.
          </p>
        ) : (
          posts.map(({ id, title, postText, coinSymbol, createdAt }) => (
            <article
              key={id}
              style={{
                background:
                  "linear-gradient(180deg, rgba(255, 255, 255, 0.85), rgba(255, 148, 211, 0.3))",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                borderRadius: 15,
                padding: 20,
                boxShadow: "0 6px 15px rgba(255, 148, 211, 0.25)",
                display: "flex",
                flexDirection: "column",
                gap: 12,
                color: "#7a2f54",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontWeight: "bold",
                  fontSize: 20,
                  color: "#ff4da6",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <img
                  src={defaultpfp}
                  alt="Post icon"
                  style={{ width: 30, height: 30, borderRadius: "50%" }}
                />
                {title}
              </h3>

              {coinSymbol && (
                <p
                  style={{
                    margin: 0,
                    fontSize: 14,
                    fontWeight: "600",
                    color: "#d9689bff",
                  }}
                >
                  Coin: {coinSymbol}
                </p>
              )}

              <p
                style={{
                  flexGrow: 1,
                  fontSize: 16,
                  lineHeight: 1.4,
                  whiteSpace: "pre-wrap",
                }}
              >
                {postText}
              </p>
              <footer
                style={{
                  fontSize: 14,
                  color: "#c2789e",
                  textAlign: "right",
                }}
              >
                Posted on {formatDate(createdAt)}
              </footer>
            </article>
          ))
        )}
      </section>
    </div>
  );
}

export default Profile;
