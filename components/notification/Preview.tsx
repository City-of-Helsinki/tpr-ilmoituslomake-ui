import React, { ReactElement, Fragment } from "react";
import { useSelector } from "react-redux";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useI18n } from "next-localization";
import { RootState } from "../../state/reducers";
import { NotifierType, PhotoPermission, LANGUAGE_OPTIONS, MAP_INITIAL_CENTER, MAP_INITIAL_ZOOM } from "../../types/constants";
import { defaultLocale } from "../../utils/i18n";
import styles from "./Preview.module.scss";

const MapWrapper = dynamic(() => import("../common/MapWrapper"), { ssr: false });

interface PreviewProps {
  full?: boolean;
}

const Preview = ({ full }: PreviewProps): ReactElement => {
  const i18n = useI18n();
  const router = useRouter();

  const notification = useSelector((state: RootState) => state.notification.notification);
  const {
    name: placeName,
    description: { short: shortDesc, long: longDesc },
    ontology_ids,
    address: {
      fi: { street: streetFi, postal_code: postalCodeFi, post_office: postOfficeFi, neighborhood: neighborhoodFi },
      sv: { street: streetSv, postal_code: postalCodeSv, post_office: postOfficeSv, neighborhood: neighborhoodSv },
    },
    location,
    phone,
    email,
    website,
    notifier: { notifier_type: notifierType, full_name: notifierFullName, email: notifierEmail, phone: notifierPhone },
  } = notification;

  const notificationExtra = useSelector((state: RootState) => state.notification.notificationExtra);
  const { inputLanguages, tagOptions, photos = [] } = notificationExtra;

  const initialCenter = MAP_INITIAL_CENTER;
  const initialZoom = MAP_INITIAL_ZOOM;

  return (
    <div className={`gridLayoutContainer ${styles.preview}`}>
      {full && <h3>{i18n.t("notification.preview.title")}</h3>}
      {!full && <h3>{i18n.t("notification.preview.placeInfo")}</h3>}

      <h4 className={`${styles.gridHeading} ${styles.gridHeader}`}>{i18n.t("notification.preview.heading")}</h4>
      <h4 className={`${styles.gridPlaceInfo} ${styles.gridHeader}`}>{i18n.t("notification.preview.placeInfo")}</h4>
      <div className={styles.headerLine}>
        <hr />
      </div>

      <h4 className={`${styles.gridHeading} ${styles.gridSubHeader}`}>{i18n.t("notification.main.basic")}</h4>
      <div className={`${styles.gridPlaceInfo} ${styles.gridSubHeader}`} />
      <div className={`${styles.gridHeading} ${styles.gridContent}`}>{i18n.t("notification.description.placeName.label")}</div>
      <div className={`${styles.gridPlaceInfo} ${styles.gridContent}`}>
        {LANGUAGE_OPTIONS.map((option) =>
          inputLanguages.includes(option) && (placeName[option] as string).length > 0 ? (
            <div key={`placeName_${option}`}>{`${option.toUpperCase()}: ${placeName[option] as string}`}</div>
          ) : null
        )}
      </div>
      <div className={`${styles.gridHeading} ${styles.gridContent}`}>{i18n.t("notification.description.shortDescription.label")}</div>
      <div className={`${styles.gridPlaceInfo} ${styles.gridContent}`}>
        {LANGUAGE_OPTIONS.map((option) =>
          inputLanguages.includes(option) && (shortDesc[option] as string).length > 0 ? (
            <div key={`shortDesc_${option}`}>{`${option.toUpperCase()}: ${shortDesc[option] as string}`}</div>
          ) : null
        )}
      </div>
      <div className={`${styles.gridHeading} ${styles.gridContent}`}>{i18n.t("notification.description.longDescription.label")}</div>
      <div className={`${styles.gridPlaceInfo} ${styles.gridContent}`}>
        {LANGUAGE_OPTIONS.map((option) =>
          inputLanguages.includes(option) && (longDesc[option] as string).length > 0 ? (
            <div key={`longDesc_${option}`}>{`${option.toUpperCase()}: ${longDesc[option] as string}`}</div>
          ) : null
        )}
      </div>
      <div className={`${styles.gridHeading} ${styles.gridContent}`}>{i18n.t("notification.tags.title")}</div>
      <div className={`${styles.gridPlaceInfo} ${styles.gridContent}`}>
        {tagOptions
          .filter((tag) => ontology_ids.includes(tag.id))
          .map((tag) => (
            <div key={`tag_${tag.id}`}>{tag.ontologyword[router.locale || defaultLocale] as string}</div>
          ))}
      </div>

      {full && (
        <>
          <div className={`${styles.gridHeading} ${styles.gridContent}`}>{i18n.t("notification.notifier.notifierType")}</div>
          <div className={`${styles.gridPlaceInfo} ${styles.gridContent}`}>
            {notifierType === NotifierType.Representative && i18n.t("notification.notifier.representative")}
            {notifierType === NotifierType.NotRepresentative && i18n.t("notification.notifier.notRepresentative")}
          </div>
          <div className={`${styles.gridHeading} ${styles.gridContent}`}>{i18n.t("notification.notifier.fullName.label")}</div>
          <div className={`${styles.gridPlaceInfo} ${styles.gridContent}`}>{notifierFullName}</div>
          <div className={`${styles.gridHeading} ${styles.gridContent}`}>{i18n.t("notification.notifier.email.label")}</div>
          <div className={`${styles.gridPlaceInfo} ${styles.gridContent}`}>{notifierEmail}</div>
          <div className={`${styles.gridHeading} ${styles.gridContent}`}>{i18n.t("notification.notifier.phone.label")}</div>
          <div className={`${styles.gridPlaceInfo} ${styles.gridContent}`}>{notifierPhone}</div>
        </>
      )}

      <h4 className={`${styles.gridHeading} ${styles.gridSubHeader}`}>{i18n.t("notification.main.contact")}</h4>
      <div className={`${styles.gridPlaceInfo} ${styles.gridSubHeader}`} />
      <div className={`${styles.gridHeading} ${styles.gridContent}`}>{i18n.t("notification.location.title")}</div>
      <div className={`${styles.gridPlaceInfo} ${styles.gridContent}`}>
        {router.locale !== "sv"
          ? `${streetFi}${streetFi.length > 0 ? "," : ""} ${postalCodeFi} ${postOfficeFi}${neighborhoodFi.length > 0 ? ` (${neighborhoodFi})` : ""}`
          : `${streetSv}${streetSv.length > 0 ? "," : ""} ${postalCodeSv} ${postOfficeSv}${neighborhoodSv.length > 0 ? ` (${neighborhoodSv})` : ""}`}
      </div>
      <div className={`${styles.gridHeading} ${styles.gridContent}`}>{i18n.t("notification.map.title")}</div>
      <div className={`${styles.gridPlaceInfo} ${styles.gridContent}`}>
        <MapWrapper
          className={styles.map}
          initialCenter={initialCenter as [number, number]}
          initialZoom={initialZoom}
          location={location}
          draggableMarker={false}
        />
      </div>

      <div className={`${styles.gridHeading} ${styles.gridContent}`}>{i18n.t("notification.contact.phone.label")}</div>
      <div className={`${styles.gridPlaceInfo} ${styles.gridContent}`}>{phone}</div>
      <div className={`${styles.gridHeading} ${styles.gridContent}`}>{i18n.t("notification.contact.email.label")}</div>
      <div className={`${styles.gridPlaceInfo} ${styles.gridContent}`}>{email}</div>
      <div className={`${styles.gridHeading} ${styles.gridContent}`}>{i18n.t("notification.links.website.label")}</div>
      <div className={`${styles.gridPlaceInfo} ${styles.gridContent}`}>
        {LANGUAGE_OPTIONS.map((option) =>
          inputLanguages.includes(option) && (website[option] as string).length > 0 ? (
            <div key={`website_${option}`}>{`${option.toUpperCase()}: ${website[option] as string}`}</div>
          ) : null
        )}
      </div>

      {full && photos.length > 0 && (
        <>
          <h4 className={`${styles.gridHeading} ${styles.gridSubHeader}`}>{i18n.t("notification.main.photos")}</h4>
          <div className={`${styles.gridPlaceInfo} ${styles.gridSubHeader}`} />
          {photos.map(({ url, altText, permission, source, preview }, index) => {
            const key = `photo_${index}`;
            return (
              <Fragment key={key}>
                <div className={`${styles.gridHeading} ${styles.gridContent}`}>{`${i18n.t("notification.photos.photo.title")} ${index + 1}`}</div>
                <div className={`${styles.gridPlaceInfo} ${styles.gridContent}`}>
                  <div>{url}</div>
                  {preview && preview.length > 0 && (
                    <div className={styles.imagePreview}>
                      <img src={preview} alt="" />
                    </div>
                  )}
                </div>
                <div className={`${styles.gridHeading} ${styles.gridContent}`}>{i18n.t("notification.photos.altText.label")}</div>
                <div className={`${styles.gridPlaceInfo} ${styles.gridContent}`}>
                  {LANGUAGE_OPTIONS.map((option) => {
                    const key2 = `altText_${index}_${option}`;
                    return inputLanguages.includes(option) && (altText[option] as string).length > 0 ? (
                      <div key={key2}>{`${option.toUpperCase()}: ${altText[option] as string}`}</div>
                    ) : null;
                  })}
                </div>
                <div className={`${styles.gridHeading} ${styles.gridContent}`}>{i18n.t("notification.photos.permission.label")}</div>
                <div className={`${styles.gridPlaceInfo} ${styles.gridContent}`}>
                  {permission === PhotoPermission.MyHelsinki && i18n.t("notification.photos.permission.myHelsinki2")}
                  {permission === PhotoPermission.CreativeCommons && i18n.t("notification.photos.permission.creativeCommons3")}
                </div>
                <div className={`${styles.gridHeading} ${styles.gridContent}`}>{i18n.t("notification.photos.source.label")}</div>
                <div className={`${styles.gridPlaceInfo} ${styles.gridContent}`}>{source}</div>
              </Fragment>
            );
          })}
        </>
      )}
    </div>
  );
};

Preview.defaultProps = {
  full: true,
};

export default Preview;
