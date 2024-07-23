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
      question: "What clustering algorithms are available?",
      answer: `Our platform offers a variety of clustering algorithms to suit different analysis needs:
      <ul>
        <li><strong>K-means:</strong> A widely used algorithm that partitions data into k distinct clusters based on distance from cluster centers.</li>
        <li><strong>Hierarchical Clustering:</strong> An algorithm that builds a hierarchy of clusters using a tree-like structure, suitable for exploring data at different levels of granularity.</li>
        <li><strong>Fuzzy C-means:</strong> An algorithm that allows data points to belong to multiple clusters with varying degrees of membership, useful for overlapping clusters.</li>
        <li><strong>GMM (Gaussian Mixture Model):</strong> A probabilistic model that assumes data is generated from a mixture of several Gaussian distributions, ideal for capturing complex cluster shapes.</li>
        <li><strong>Spectral Clustering:</strong> A technique that uses eigenvalues of similarity matrices to reduce dimensions and find clusters, effective for non-convex shapes and complex data structures.</li>
      </ul>`,
    },
    {
      question: "What outlier detection algorithms are available?",
      answer:
        `Our platform provides several outlier detection algorithms to help identify anomalies in your data:
        <ul>
          <li><strong>1 SD:</strong> Outliers are detected as data points that are more than 1 standard deviation from the mean.</li>
          <li><strong>2 SD:</strong> Outliers are identified as data points that are more than 2 standard deviations from the mean.</li>
          <li><strong>Isolation Forest:</strong> An algorithm that isolates outliers instead of profiling normal data points. It is effective for high-dimensional datasets.</li>
          <li><strong>Minimum Covariance Determinant:</strong> A robust method that finds a subset of data points with minimum covariance, useful for detecting outliers in multivariate data.</li>
          <li><strong>Local Outlier Factor:</strong> A method that measures the local density deviation of a data point with respect to its neighbors, identifying outliers based on their local density.</li>
          <li><strong>OneClassSVM:</strong> A support vector machine algorithm for anomaly detection, which identifies outliers by learning a decision function for a single class.</li>
        </ul>`,
    },
    {
      question: "Can I save and export my visualizations in PopMLVis?",
      answer:
        "Yes, you can save your visualizations and export them in various formats such as PNG, SVG, WEBP and JPEG. This allows you to use the visualizations in your reports and presentations.",
    },
    {
      question: "How can I contribute to PopMLVis?",
      answer:
        'We welcome contributions from the community! You can contribute by reporting issues, suggesting new features, or submitting pull requests on our <a href="https://github.com/ibrahim-Alasalimy/PopMLViz" target="_blank" rel="noopener noreferrer">GitHub repository</a>.',
    },
    {
      question: "What is PC-AIR?",
      answer: `PC-AIR (Principal Component Analysis of Individuals' Residuals) is a method used to analyze genetic data by accounting for population structure and hidden variables. It is particularly useful for understanding the relationships between individuals and their residuals after accounting for known genetic factors. This method requires data in the .bim, .bam, and .fam formats, while kinship data is optional.`,
    },
    {
      question: "How can I request a new clustering or outlier detection algorithm?",
      answer: `If you have a new clustering or outlier detection algorithm that you would like us to consider, please contact us by sending us a email <a href="mailto:popmlvissupport@QCRI.org?subject=New%20Algorithm%20Request">here</a>`,
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
        <div style={{ marginTop: 20, marginLeft: 20 }}>
          If you didnt find your answer, please checkout the documentation{" "}
          <a href={PopMLvis} target="_blank" rel="noopener noreferrer">
            here
          </a>
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
          <AppButton style={{ width: "100%" }} type={"submit"} title="submit"></AppButton>
        </form>
      </div>
    </div>
  );
}

export default Help;
