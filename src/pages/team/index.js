import React, { useEffect } from "react";

function OurTeam() {
  const members = [
    {
      name: "Sreevalli",
      image: "/assets/images/team/Sree.png",
      title: "Director of Operations",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris nisi nulla, vulputate et velit non, vestibulum pharetra urna.",
    },
    {
      name: "Mark Walpole",
      image: "/assets/images/team/Mark.png",
      title: "Director of Sales",
      description: "",
    },
    {
      name: "Indhumathy",
      image: "/assets/images/team/Indhu.png",
      title: "Director of Revenue",
      description: "",
    },
    {
      name: "Srikanth Baskaran",
      image: "/assets/images/team/Srikanth.png",
      title: "Enterprise Solutions Architect",
      description: "",
    },
    {
      name: "Areef Syed",
      image: "/assets/images/team/Areef.png",
      title: "Director of Design",
      description: "",
    },
    {
      name: "Priyanka Karthikeyan",
      image: "/assets/images/team/Priyanka.png",
      title: "Auction.io - Product Manager",
      description: "",
    },
    {
      name: "Gagan Singla",
      image: "/assets/images/team/Gagan.png",
      title: "DevOps and Support - US",
      description: "",
    },
    {
      name: "Yifei Chen",
      image: "/assets/images/team/Yifei.png",
      title: "Lead Developer - US",
      description: "",
    },

    {
      name: "Avisha",
      image: "/assets/images/team/Avisha.png",
      title: "Designer - US",
      description: "",
    },
    {
      name: "Sathish Lakshmanan",
      image: "/assets/images/team/Sathish.png",
      title: "TPL - Lead Developer",
      description: "",
    },
    {
      name: "Ramya Karthikeyan",
      image: "/assets/images/team/Ramya.png",
      title: "Director of Testing and Automation",
      description: "",
    },
    {
      name: "Chris Pravin",
      image: "/assets/images/team/Chris.png",
      title: "TAC Manager Technical Assistance",
      description: "",
    },
    {
      name: "Kishan",
      image: "/assets/images/team/Kishan.png",
      title: "Senior Fullstack Engineer",
      description: "",
    },
    {
      name: "Rajkumar",
      image: "/assets/images/team/Rajkumar.png",
      title: "Senior Fullstack Engineer",
      description: "",
    },
    {
      name: "Saurabh",
      image: "/assets/images/team/Saurabh.png",
      title: "AuctionPay - Lead Engineer",
      description: "",
    },

    {
      name: "Sudheesh",
      image: "/assets/images/team/Sudheesh.png",
      title: "Senior Fullstack Engineer",
      description: "",
    },
    {
      name: "Saanmugakumar",
      image: "/assets/images/team/Sam.png",
      title: "Backend Engineer",
      description: "",
    },
    {
      name: "Nandhini",
      image: "/assets/images/team/Nandhini.png",
      title: "QA Lead",
      description: "",
    },
    {
      name: "Tommy",
      image: "/assets/images/team/Tommy.png",
      title: "UI/UX Designer (Contractor)",
      description: "",
    },
    {
      name: "Brandon",
      image: "/assets/images/team/Brandon.png",
      title: "UI/UX Designer (Contractor)",
      description: "",
    },
    {
      name: "Amy",
      image: "/assets/images/team/Amy.png",
      title: "Business Analyst (Contractor)",
      description: "",
    },
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div class="our-team-wrapper">
      <div class="our-team-top">
        <h1>Meet Our Team</h1>
      </div>
      <div class="our-team-container">
        <div class="our-team-row first">
          <div class="our-team-col">
            <div class="our-team-card">
              <div class="imgCnt">
                <img
                  src="/assets/images/team/Raj.png"
                  alt="Rajesh Rajaram"
                  class="ot-card-img"
                />
              </div>
              <h2 class="otc-head">Rajesh Rajaram</h2>
              <h6 class="otc-sub-head">CEO</h6>
              <p class="otc-desc">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris
                nisi nulla, vulputate et velit non, vestibulum pharetra urna.
              </p>
            </div>
          </div>
        </div>
        <div class="our-team-row">
          {members.map((data, index) => (
            <div class="our-team-col">
              <div class="our-team-card">
                <div class="imgCnt">
                  <img src={data.image} alt={data.name} class="ot-card-img" />
                </div>
                <h2 class="otc-head">{data.name}</h2>
                <h6 class="otc-sub-head">{data.title}</h6>
                <p class="otc-desc">{data.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default OurTeam;
