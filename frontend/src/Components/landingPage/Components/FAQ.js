import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FAQ.css";
import PopMLvis from "../../../assets/PopMLvis.pdf";
import logo from "../../../assets/logo.jpeg";

function FAQ() {
  const [openQuestionIndex, setOpenQuestionIndex] = useState(null);
  const navigate = useNavigate();

  const toggleQuestion = (index) => {
    setOpenQuestionIndex(openQuestionIndex === index ? null : index);
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  const faqData = [
    {
      question: "What is PopMLVis?",
      answer:
        "PopMLVis is a tool designed to visualize population genetic datasets interactively using dimensionality reduction algorithms, machine learning models, and statistical measurements. It provides an intuitive interface for analyzing and understanding genetic data.",
    },
    {
      question: "How do I get started with PopMLVis?",
      answer:
        'To get started, simply navigate to the <a href="/Dashboard">Dashboard</a> and upload your population genetic dataset. You can then select the visualization and analysis options that best suit your needs.',
    },
    {
      question: "What types of data can I upload?",
      answer:
        "PopMLVis supports a variety of genetic data formats including VCF, PLINK, and CSV files containing genetic information. Make sure your data is properly formatted before uploading.",
    },
    {
      question: "Which dimensionality reduction algorithms are available?",
      answer:
        "PopMLVis offers multiple dimensionality reduction algorithms such as PCA, t-SNE, UMAP, and others. You can choose the one that best fits your analysis requirements.",
    },
    {
      question: "Can I save and export my visualizations?",
      answer:
        "Yes, you can save your visualizations and export them in various formats such as PNG, SVG, and PDF. This allows you to use the visualizations in your reports and presentations.",
    },
    {
      question: "Is there a user manual or documentation available?",
      answer:
        `Yes, you can find the user manual and detailed documentation <a href=${PopMLvis}>here</a>. It provides comprehensive information on how to use all the features of PopMLVis.`,
    },
    {
      question: "How can I contribute to PopMLVis?",
      answer:
        'We welcome contributions from the community! You can contribute by reporting issues, suggesting new features, or submitting pull requests on our <a href="https://github.com/qcri/QCAI-PopMLVis" target="_blank" rel="noopener noreferrer">GitHub repository</a>.',
    },
    {
      question: "Who can I contact for support?",
      answer:
        "If you need help or have any questions, feel free to contact our support team at support@popmlvis.com. We're here to assist you!",
    },
  ];

  return (
    <div className="faq-page">
      <header className="faq-header">
        <div className="header-content" onClick={handleLogoClick}>
          <img src={logo} alt="PopMLVis Logo" className="logo" />
          <span className="site-name">PopMLVis</span>
        </div>
      </header>
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
    </div>
  );
}

export default FAQ;