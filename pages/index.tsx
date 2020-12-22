import React, { ReactElement } from "react";
import { Button, IconAngleRight, IconLocation, IconPenLine, IconEye, Card, Koros } from "hds-react";
import { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { useI18n } from "next-localization";
import i18nLoader from "../utils/i18n";
import Layout from "../components/common/Layout";
import Header from "../components/common/Header";

import styles from "./index.module.scss";

const Main = (): ReactElement => {
  const i18n = useI18n();

  return (
    <Layout>
      <Head>
        <title>TITLE</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <div className={styles.korosTextBox}>
        <h1>Pidetään yhdessä Helsingin parhaiden paikkojen tiedot ajantasalla!</h1>
      </div>
      <Koros flipHorizontal className={styles.koros} />
      <div className={styles.infoTextBox}>
        <h3>
          My Helsinki Places kerää ja ylläpitää tietoa Helsingin kohteista paikallisten ja matkailijoiden hyödyksi. Tässä palvelussa voit ilmoittaa
          kohteet tiedot tai tehdä muutoksia jo olemassa oleviin kohdetietoihin.
        </h3>
      </div>
      <div className={styles.infoLinkContainer}>
        <h4>
          Lue tietojen ilmoittamisesta <IconAngleRight />
        </h4>
        <h4>
          Lue saavutettavuusseloste <IconAngleRight />
        </h4>
      </div>
      <div className={styles.boxContainer}>
        <h1>Ilmoita kohteiden tietoja</h1>
        <div className={`${styles.notificationBox} ${styles.box}`}>
          <IconLocation className={styles.icon} size="xl" />
          <Card
            className={styles.noBackground}
            heading="Haluatko lisätä uuden kohteen palveluun?"
            text="Ilmoita palveluun uusia toimipisteitä ja kohteita. Kirjaudu ensin ja ilmoita puuttuva kohde jo tänään."
          />
          <Button variant="secondary" className={styles.button} onClick={() => window.open("/notification/", "_self")}>
            Ilmoita uusi kohde
          </Button>
        </div>
        <div className={`${styles.changeRequestBox} ${styles.box}`}>
          <IconPenLine className={styles.icon} size="xl" />
          <Card
            className={styles.noBackground}
            heading="Anna meille vinkki!"
            text="Mikäli huomasit puuttuvan, virheellisen tai vanhentuneen tiedon, tee palvelus ja ilmoita siitä meille. Voit tehdä ilmoituksen vaivattomasti rekisteröitymättä."
          />
          <Button variant="secondary" className={styles.button} onClick={() => null}>
            Vinkkaa meille
          </Button>
        </div>
        <div className={`${styles.inspectionBox} ${styles.box}`}>
          <IconEye className={styles.icon} size="xl" />
          <Card
            className={styles.noBackground}
            heading="Mistä tietoja kohteesta löytyy?"
            text="Tarkista, onko kohde jo ilmoitettu meille ja mitä tietoa siitä on olemassa."
          />
          <Button variant="secondary" className={styles.button} onClick={() => null}>
            Tarkista kohteen tiedot
          </Button>
        </div>
      </div>
    </Layout>
  );
};

// Static Generation
export const getStaticProps: GetStaticProps = async ({ locales }) => {
  const lngDict = await i18nLoader(locales);

  return {
    props: {
      lngDict,
    },
  };
};

export default Main;
