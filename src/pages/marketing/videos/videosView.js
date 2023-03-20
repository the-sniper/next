import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { Button } from "@mui/material";
import { handleRedirectInternal } from "@/common/components";
import { useRouter } from "next/router";

const VideosView = () => {
  const [vdoTitle, setVdoTitle] = useState("");
  const [vdoURL, setVdoURL] = useState("");
  const router = useRouter();

  useEffect(() => {
    router?.query.type === "tamizhum_saraswathiyum" ? (
      <>
        {
          (setVdoTitle("Tamizhum Saraswathiyum"),
          setVdoURL("/assets/videos/tamizh.mp4"))
        }
      </>
    ) : router?.query.type === "super_singer" ? (
      <>
        {
          (setVdoTitle("Super Singer"),
          setVdoURL("/assets/videos/supersinger.mp4"))
        }
      </>
    ) : router?.query.type === "pandian_stores" ? (
      <>
        {
          (setVdoTitle("Pandian Stores"),
          setVdoURL("/assets/videos/pandiyanstores.mp4"))
        }
      </>
    ) : router?.query.type === "eeramana_rojave" ? (
      <>
        {
          (setVdoTitle("Eeramana Rojave"),
          setVdoURL("/assets/videos/eeramanrojave.mp4"))
        }
      </>
    ) : router?.query.type === "cooku_with_comali" ? (
      <>
        {
          (setVdoTitle("Cooku With Comali"),
          setVdoURL("/assets/videos/cookwithcomali.mp4"))
        }
      </>
    ) : router?.query.type === "big_boss" ? (
      <>{(setVdoTitle("Big Boss"), setVdoURL("/assets/videos/bigboss.mp4"))}</>
    ) : (
      <>{(setVdoTitle(""), setVdoURL(""))}</>
    );
  }, [router?.query.type]);
  return (
    <div className="vdosWrapper vdoVwWrpr">
      <div className="vdoTtle">
        <h2>{vdoTitle}</h2>
      </div>
      <div className="vdoPlyrCntnr">
        <ReactPlayer
          url={vdoURL}
          playing="true"
          width="100%"
          controls
          autoPlay
          playsInline
        />
      </div>
      <Button
        className="backButton"
        onClick={() => handleRedirectInternal(router, "vijaytv/videos")}
      >
        <span className="material-icons">keyboard_backspace</span> View All
      </Button>
    </div>
  );
};

export default VideosView;
