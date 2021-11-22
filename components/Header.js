import React from "react";
import Head from "next/head";

export default class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: props.title,
    };
  }

  render() {
    return (
      <Head>
        <title>{this.state.title}</title>
        <link rel="icon" type="image/png" href="/icon.png" />
      </Head>
    );
  }
}
