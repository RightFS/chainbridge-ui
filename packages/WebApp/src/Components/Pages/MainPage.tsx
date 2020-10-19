import React, { useState } from "react";

import { makeStyles, ITheme, createStyles } from "@imploy/common-themes";
import AboutDrawer from "../../Modules/AboutDrawer";
import ChangeNetworkDrawer from "../../Modules/ChangeNetworkDrawer";
import NetworkUnsupportedModal from "../../Modules/NetworkUnsupportedModal";
import TransactionModal from "../../Modules/TransactionModal";
import {
  Button,
  Typography,
  FormikSelectInput,
  Grid,
  FormikTextInput,
  FormikCheckboxInput,
  CheckboxInput,
} from "@imploy/common-components";
import { Formik, Form } from "formik";
import { useWeb3 } from "@chainsafe/web3-context";
import { useChainbridge } from "../../Contexts/ChainbridgeContext";

const useStyles = makeStyles(
  ({ palette, constants, typography, breakpoints }: ITheme) =>
    createStyles({
      root: {},
      connectButton: {},
      connecting: {},
      connected: {},
      formArea: {},
      maxButton: {},
      token: {},
    })
);

const MainPage = () => {
  const classes = useStyles();
  const { isReady, checkIsReady, wallet, onboard, tokens } = useWeb3();
  const { homeChain, destinationChains, destinationChain } = useChainbridge();
  const [aboutDrawerOpen, setAboutDrawerOpen] = useState(false);
  const [changeNetworkDrawerOpen, setChangeNetworkDrawerOpen] = useState(false);
  const [
    networkUnsupportedModalActive,
    setNetworkUnsupportedModalActive,
  ] = useState(false);
  const [sendToSelf, setSendToSelf] = useState(false);
  const [transactionModalActive, setTransactionModalActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleToggleSetToSelf = () => {
    if (sendToSelf) {
      setSendToSelf(false);
      //set formik value to undefined
    } else {
      setSendToSelf(true);
      //set formik value to user address
    }
  };

  const handleConnect = async () => {
    !wallet && (await onboard?.walletSelect());
    setIsConnecting(true);
    await checkIsReady();
    setIsConnecting(false);
  };
  console.log(tokens);
  return (
    <article className={classes.root}>
      {!isReady && (
        <Button className={classes.connectButton} onClick={handleConnect}>
          Connect Wallet
        </Button>
      )}
      {isConnecting && (
        <section className={classes.connecting}>
          <Typography component="p" variant="body2">
            This app requires access to your wallet, please login and authorize
            access to continue.
          </Typography>
        </section>
      )}
      {isReady && homeChain && (
        <section className={classes.connected}>
          <Typography variant="body2">{homeChain.name}</Typography>
        </section>
      )}
      <Formik
        initialValues={{
          destinationChain: destinationChain?.chainId,
          token: undefined,
          tokenAmount: "",
          sendToSelf: false,
          destinationAddress: undefined,
        }}
        onSubmit={(values: any) => {
          console.log("values");
        }}
      >
        <Form className={classes.formArea}>
          <Grid container flexDirection="column" fullWidth>
            <Grid item xs={12}>
              <FormikSelectInput
                label="Destination Network"
                name="destinationChain"
                options={destinationChains.map((dc) => ({
                  value: dc.chainId,
                  label: dc.name,
                }))}
              />
            </Grid>
            <Grid item sm={10} xs={12}>
              <FormikTextInput name="tokenAmount" type="number" />
              <Button
                className={classes.maxButton}
                variant="primary"
                type="button"
              >
                MAX
              </Button>
            </Grid>
            <Grid item sm={2} xs={12}>
              <FormikSelectInput
                name="token"
                options={Object.keys(tokens).map((t) => ({
                  value: t,
                  label: tokens.get(t)?.name || t,
                }))}
              />
            </Grid>
            <Grid item xs={12}>
              <FormikTextInput
                name="destinationAddress"
                label="Destination Address"
                placeholder="Please enter the recieving address"
              />
            </Grid>
            <Grid item xs={12}>
              <CheckboxInput
                label="I want to send funds to my address"
                value={sendToSelf}
                onChange={handleToggleSetToSelf}
              />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" fullsize variant="primary">
                Start transfer
              </Button>
            </Grid>
            <Grid item xs={12}>
              Question mark
            </Grid>
          </Grid>
        </Form>
      </Formik>
      <AboutDrawer open={aboutDrawerOpen} />
      <ChangeNetworkDrawer open={changeNetworkDrawerOpen} />
      <NetworkUnsupportedModal active={networkUnsupportedModalActive} />
      <TransactionModal open={transactionModalActive} />
    </article>
  );
};

export default MainPage;
