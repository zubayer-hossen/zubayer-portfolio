export default function PageHeader({ title, text, children }) {
  return (
    <header className="container-x pb-10 pt-14 sm:pt-20">
      <h1 className="h-display max-w-3xl">{title}</h1>
      {text && <p className="lead mt-5">{text}</p>}
      {children}
    </header>
  );
}
