function Error({ statusCode }: { statusCode?: number }) {
  return (
    <div className="text-center" style={{ padding: "100px 20px" }}>
      <h1 className="text-3xl font-bold">
        {statusCode || "Error"}
      </h1>
      <p className="mt-2 kami-text-muted">
        {statusCode === 404
          ? "Page not found"
          : "An error occurred"}
      </p>
    </div>
  );
}

Error.getInitialProps = ({ res, err }: { res?: { statusCode: number }; err?: { statusCode: number } }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
