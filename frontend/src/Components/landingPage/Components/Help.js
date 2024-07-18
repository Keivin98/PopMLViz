import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Help.css";
import PopMLvis from "../../../assets/PopMLvis.pdf";
import logo from "../../../assets/logo.jpeg";
import AppNav from "./AppNav";
import AppButton from "../../AppButton";

function Help() {
  const [openQuestionIndex, setOpenQuestionIndex] = useState(null);
  // const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const toggleQuestion = (index) => {
    setOpenQuestionIndex(openQuestionIndex === index ? null : index);
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const mailtoLink = `mailto:popmlvissupport@QCRI.org?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(
      message
    )}`;
    window.location.href = mailtoLink;
  };

  const faqData = [
    {
      question: "What is GWAS (Genome-Wide Association Study)?",
      answer:
        "A Genome-Wide Association Study (GWAS) is a research method used to identify genetic variants associated with specific traits or diseases by scanning the genomes of many individuals.",
    },
    {
      question: "Why are GWAS important in genetic research?",
      answer:
        "GWAS help researchers understand the genetic basis of diseases and traits, identify potential therapeutic targets, and advance personalized medicine by linking genetic variations to health outcomes.",
    },
    {
      question: "What types of data are used in GWAS?",
      answer:
        "GWAS typically use data from single nucleotide polymorphisms (SNPs), which are variations at single positions in the DNA sequence among individuals.",
    },
    {
      question: "How is data prepared for GWAS?",
      answer:
        "Data preparation for GWAS involves quality control steps such as filtering out low-quality genotypes, imputing missing data, and normalizing phenotypic data to ensure accurate and reliable results.",
    },
    {
      question: "What are the key steps in conducting a GWAS?",
      answer:
        "The key steps in GWAS include collecting and preparing genetic and phenotypic data, performing statistical analysis to identify associations, and validating findings through replication studies and functional experiments.",
    },
    {
      question: "How do I get started with PopMLVis?",
      answer:
        'To get started, simply navigate to the <a href="/Dashboard">Dashboard</a> and upload your population genetic dataset. You can then select the visualization and analysis options that best suit your needs.',
    },
    {
      question: "What types of data can I upload to PopMLVis?",
      answer:
        "PopMLVis supports a variety of genetic data formats including, Pickle file, correlation matrix, .bed, .bim, and .fam, and CSV files containing genetic information. Make sure your data is properly formatted before uploading.",
    },
    {
      question: "Which dimensionality reduction algorithms are available in PopMLVis?",
      answer:
        "PopMLVis offers multiple dimensionality reduction algorithms such as PCA, t-SNE, UMAP, and others. You can choose the one that best fits your analysis requirements.",
    },
    {
      question: "Can I save and export my visualizations in PopMLVis?",
      answer:
        "Yes, you can save your visualizations and export them in various formats such as PNG, SVG, WEBP and JPEG. This allows you to use the visualizations in your reports and presentations.",
    },
    {
      question: "Is there a user manual or documentation available for PopMLVis?",
      answer: `Yes, you can find the user manual and detailed documentation <a href="${PopMLvis}" target="_blank" rel="noopener noreferrer">here</a>. It provides comprehensive information on how to use all the features of PopMLVis.`,
    },
    {
      question: "How can I contribute to PopMLVis?",
      answer:
        'We welcome contributions from the community! You can contribute by reporting issues, suggesting new features, or submitting pull requests on our <a href="https://github.com/ibrahim-Alasalimy/PopMLViz" target="_blank" rel="noopener noreferrer">GitHub repository</a>.',
    },
  ];

  return (
    <div className="faq-page">
      <AppNav></AppNav>
      <div className="faq-content">
        <div className="faq-container">
          <h2>Frequently Asked Questions</h2>
          {faqData.map((faq, index) => (
            <div key={index} className="faq-item">
              <div className="faq-question" onClick={() => toggleQuestion(index)}>
                <h3>{faq.question}</h3>
              </div>
              {openQuestionIndex === index && (
                <div className="faq-answer">
                  <p dangerouslySetInnerHTML={{ __html: faq.answer }}></p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="contact-form">
        <h2>Contact Us</h2>
        <form onSubmit={handleSubmit}>
          {/* <label htmlFor="email">Your Email:</label> */}
          {/* <input type="email" id="email" name="email" value={email} onChange={handleEmailChange} required /> */}
          <label htmlFor="title">Title:</label>
          <input type="text" id="title" name="title" value={title} onChange={handleTitleChange} required />
          <label htmlFor="message">Message:</label>
          <textarea id="message" name="message" value={message} onChange={handleMessageChange} rows="4" required />
          <AppButton style={{width: "100%"}} type={"submit"} title="submit"></AppButton>
        </form>
      </div>
    </div>
  );
}

export default Help;
