function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <img src="/assets/images/logo.png" alt="3 Point Arts" height={32} />
        <span>© {new Date().getFullYear()} 3 Point Arts — 3D Print Studio</span>
      </div>
    </footer>
  )
}

export default Footer
