import React, { useState, useEffect, useContext } from "react";
import { Button } from "@material-ui/core";
import ProductContext from "@/context/product/productContext";
import Loaders from "@/components/molecules/Loaders";
import { useRouter } from "next/router";
import PluginsViewPage from "./index_function";

const PluginView = () => {
  const router = useRouter();
  let p_type = router.query.type;

  const { plugin_lists, availablePluginList } = useContext(ProductContext);

  const [pluginData, setPluginData] = useState("");

  useEffect(() => {
    availablePluginList();
  }, []);

  useEffect(() => {
    let data = plugin_lists.filter((d) => d.plugin_name === p_type);
    setPluginData(data[0]);
  }, [plugin_lists]);

  return (
    <div className="flscrnDscrptnPopup">
      <PluginsViewPage p_type={p_type} pluginData={pluginData} />
    </div>
  );
};

export default PluginView;
