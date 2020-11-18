/* eslint-disable new-cap */
import React, { ReactElement, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useI18n } from "next-localization";
import { Map as OpenLayersMap, MapEvent } from "ol";
import { RootState } from "../../state/reducers";
import styles from "./Map.module.scss";

const Map = (): ReactElement => {
  const i18n = useI18n();

  const [map, setMap] = useState<OpenLayersMap>();

  const onMoveEnd = (evt: MapEvent) => {
    console.log("onMoveEnd", evt.map.getView().getCenter(), evt.map.getView().getZoom());
  };

  useEffect(() => {
    if (!map) {
      // Create a promise for initialising the map
      const createMap = async () => {
        // Import the OpenLayers components here to work around incompatibility with next.js
        const OlMap = await import("ol/Map");
        const View = await import("ol/View");
        const { defaults } = await import("ol/control");
        const TileLayer = await import("ol/layer/Tile");
        const TileJSON = await import("ol/source/TileJSON");

        const mapObj = new OlMap.default({
          target: "mapDiv",
          layers: [
            new TileLayer.default({
              source: new TileJSON.default({
                url: "http://tiles.hel.ninja/styles/hel-osm-bright.json",
              }),
            }),
          ],
          view: new View.default({
            center: [2776512, 8436693],
            zoom: 13,
          }),
          controls: defaults({ attribution: false }),
        });

        // TEST
        mapObj.on("moveend", onMoveEnd);

        return mapObj;
      };

      // Resolve the promise and put the map object into local state
      createMap().then((mapObj) => {
        setMap(mapObj);
      });
    }
  }, [map]);

  return (
    <div className="formSection">
      <h2>{i18n.t("notification.map.title")}</h2>
      <div id="mapDiv" className={styles.map} />
    </div>
  );
};

export default Map;
