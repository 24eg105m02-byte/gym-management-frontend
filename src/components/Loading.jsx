function Loading({ text = "Loading..." }) {
  return (
    <div className="fc-loading" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      <div
        style={{
          width: 36,
          height: 36,
          border: "3px solid #292929",
          borderTopColor: "#ff4d00",
          borderRadius: "50%",
          animation: "fcspin 0.8s linear infinite",
        }}
      />
      <p>{text}</p>
      <style>{`@keyframes fcspin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default Loading;
