import React, { Component } from "react";
import PropTypes from "prop-types";

class Dendrogram extends Component {
  state = {
    image: "",
  };
  componentDidMount = () => {
    this.setState({ image: this.props.dendrogramPath });
  };
  componentDidUpdate = (prevProps) => {
    if (prevProps.dendrogramPath !== this.props.dendrogramPath) {
      this.setState({ image: this.props.dendrogramPath });
    }
  };
  render() {
    return (
      <div>
        {this.state.image !== "" && (
          <img
            src={`${process.env.REACT_APP_PROTOCOL}://${process.env.REACT_APP_DOMAIN}${process.env.REACT_APP_PORT}/api/dendrogram/${this.state.image}`}
            style={styles.image}
          />
        )}
      </div>
    );
  }
}

const styles = {
  image: {
    position: "fixed",
    z_index: 1,
    top: 0,
    overflow_x: "hidden",
    left: 0,
    marginTop: "13%",
    marginLeft: "23%",
    width: "55%",
    height: "72%",
  },
};
Dendrogram.propTypes = {
  dendrogramPath: PropTypes.string,
};

export default Dendrogram;
