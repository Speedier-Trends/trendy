import FavoritesCarousel from "../containers/FavoritesCarousel";
import React, { useEffect, useState } from "react";
import favorites from "../containers/testData";
import { useOutletContext } from "react-router-dom";

export default function Favorites() {
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useOutletContext();
  const [faveList, setFaveList] = useState([]);

  // update this
  useEffect(() => {
    const favedData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/fav/${userName}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const favListArr = await response.json();
        setFaveList(favListArr);
        setIsLoading(false);
      } catch (err) {
        return err;
      }
    };

    favedData();
  }, [userName]);

  return isLoading ? (
    <div>Your Favorites are Loading</div>
  ) : (
    <div className="Favorites">
      <h1>Favorites</h1>
      <div>
        <FavoritesCarousel data={faveList}></FavoritesCarousel>
      </div>
    </div>
  );
}
