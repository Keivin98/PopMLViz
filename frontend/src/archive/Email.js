import React, { Component } from "react";

function sendMail() {
  var body = document.getElementById("myText").value;
  var subject = document.getElementById("Subject").value;
  window.location.href = `mailto:popmlvissupport@QCRI.org?subject=${subject}&body=${body}`;
}

class Email extends Component {
  render() {
    return (
      <div className="Email" method="post">
        <h1 align="center" style={{ fontWeight: "200" }}>
          Contact Us
        </h1>
        <div className="newsbox">
          <label htmlFor="contactMessage">
            Message <span className="required">*</span>
          </label>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <textarea rows="1" id="Subject" placeholder="Subject" />
            <textarea
              rows="7"
              id="myText"
              name="contactMessage"
              placeholder="Please leave your suggestions or queries here"
              style={{ marginTop: 10 }}
            />
          </div>
        </div>
        <div style={{ marginLeft: "40%" }}>
          <button onClick={sendMail} type="submit" class="btn">
            Send Mail
          </button>
        </div>
      </div>
    );
  }
}

export default Email;
