import { useState, useEffect } from "react";
import { client } from "../lib/sanity";

export function useSanityData() {
  const [data, setData] = useState({ portfolio: {}, brands: [], socials: {}, email: "" });

  useEffect(() => {
    client
      .fetch(`{
        "portfolio": *[_type == "portfolio"][0] {
          headshot { asset-> { url } }, 
          description,
          images[] { asset-> { url } }
        },
        "brands": *[_type == "brands"] { logo { asset-> { url } } },
        "socials": *[_type == "socials"][0],
        "email": *[_type == "contact"][0].email
      }`)
      .then(setData);
  }, []);
  

  return data;
}
