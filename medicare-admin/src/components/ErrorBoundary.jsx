import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("UI Error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "20px", textAlign: "center" }}>
          <h2>Une erreur est survenue</h2>
          <p>Veuillez rafraîchir la page ou contacter l'administrateur.</p>
          <button onClick={() => window.location.reload()}>
            Rafraîchir
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}