import "./App.css";
import { BASE_URL, TOKEN } from "./config";
import axios from "axios";
import { useEffect, useState } from "react";

function App() {
  const [iceCreamList, setIceCreamList] = useState([]);
  const [busReviews, setBusReviews] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState("");
  useEffect(() => {
    axios
      .get(`${BASE_URL}/search?location=${"Alpharetta"}`, {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
        params: {
          term: "ice cream",
          sort_by: "rating",
          limit: 5,
        },
      })
      .then((res) => {
        setIceCreamList(res.data.businesses);
      });
  }, []);
  const getRatings = (id, name) => {
    axios
      .get(`${BASE_URL}/${id}/reviews`, {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      })
      .then((res) => {
        setSelectedBusiness(name);
        setBusReviews(res.data.reviews);
      });
  };
  return (
    <>
      <header className="text-4xl bg-green-500 p-5">
        Top 5 Ice Creams in Alpharetta
      </header>
      <div className="App">
        <div className="col business">
          <p className="text-xs">Click to read reviews</p>
          {iceCreamList.map((bus) => (
            <section key={bus.id}>
              <div
                className="shadow-md rounded-lg"
                onClick={() => getRatings(bus.id, bus.name)}
              >
                <BusinessCard business={bus} />
              </div>
            </section>
          ))}
        </div>
        {busReviews.length > 0 && (
          <div className="col reviews">
            <h2 className="font-bold text-3xl">{`${selectedBusiness} Reviews`}</h2>
            {busReviews.map((rev) => (
              <section key={rev.id}>
                <UserReview review={rev} />
              </section>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default App;

const UserReview = (props) => {
  return (
    <figure className="md:flex shadow-md ">
      <img
        className="w-32 h-32 md:w-48 "
        src={props.review.user.image_url}
        alt=""
        width="384"
        height="512"
      />
      <div className="pt-6 md:p-8 text-center space-y-4">
        <blockquote>
          <p className="text-lg font-semibold">{props.review.text}</p>
        </blockquote>
        <figcaption className="font-medium">
          <div className="text-cyan-600">{props.review.user.name}</div>
        </figcaption>
      </div>
    </figure>
  );
};

const BusinessCard = (props) => {
  return (
    <>
      <h2 className="font-bold">{props.business.name}</h2>
      <address>{props.business.location.display_address.join()}</address>
    </>
  );
};
