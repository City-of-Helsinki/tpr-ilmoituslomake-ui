import React, { ReactElement } from "react";
import { Button, IconLocation, IconPenLine, IconEye, Card, Koros } from "hds-react";
import { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { useI18n } from "next-localization";
import i18nLoader from "../utils/i18n";
import Layout from "../components/Layout";
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
          My Helsinki Places kerää ja ylläpitää tietoa Helsingin kohteista paikallisten ja matkailijoiden hyödyksi. Tässä palvelussa voit ilmoittaa kohteet tiedot tai tehdä muutoksia jo olemassa oleviin kohdetietoihin.
        </h3>
      </div>
      <div>
        <Link href="/forms/notification">{i18n.t("notification.title")}</Link>
      </div>
      <div>
        <Link href="/forms/moderation">{i18n.t("moderation.title")}</Link>
      </div>
      <div className={styles.infoLinkContainer}>
        <div>Lue tietojen ilmoittamisesta</div>
        <div>Lue saavutettavuusseloste</div>
        <div>Ilmoita kohteiden tietoja</div>
      </div>
      <div>
        <Card className={styles.notificationBox} heading={"Haluatko lisätä uuden kohteen palveluun?"} text={"Ilmoita palveluun uusia toimipisteitä ja kohteita. Kirjaudu ensin ja ilmoita puuttuva kohde jo tänään."}>
          <IconLocation className={styles.icon} size="xl" />
          <Button variant="secondary" className={styles.button} onClick={() => (null)}>
            {"Ilmoita uusi kohde"}
          </Button>
        </Card>
        <Card className={styles.changeRequestBox} heading={"Anna meille vinkki!"} text={"Mikäli huomasit puuttuvan, virheellisen tai vanhentuneen tiedon, tee palvelus ja ilmoita siitä meille. Voit tehdä ilmoituksen vaivattomasti rekisteröitymättä."}>
          <IconPenLine className={styles.icon} size="xl" />
          <Button variant="secondary" className={styles.button} onClick={() => (null)}>
            {"Vinkkaa meille"}
          </Button>
        </Card>
        <Card className={styles.inspectionBox} heading={"Mistä tietoja kohteesta löytyy?"} text={"Tarkista, onko kohde jo ilmoitettu meille ja mitä tietoa siitä on olemassa."}>
          <IconEye className={styles.icon} size="xl" />
          <Button variant="secondary" className={styles.button} onClick={() => (null)}>
            {"Tarkista kohteen tiedot"}
          </Button>
        </Card>
      </div>
    </Layout>
  );
};

// Static Generation
export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const lngDict = await i18nLoader(locale);

  return {
    props: {
      lngDict,
    },
  };
};

export default Main;
