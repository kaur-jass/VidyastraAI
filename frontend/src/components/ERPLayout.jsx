

const ERPLayout = ({ children, user, onLogout, onNavigate, isPublic = false }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#e9ecef' }}>

      {/* Yellow Strip + Header with Logo */}
      <div className="container-fluid" style={{ backgroundColor: '#003A6A', width: '100%', padding: '0 0 10px 0' }}>
        <div className="row" style={{ backgroundColor: '#FECD0B', height: '4px', margin: '0' }}></div>

        <div className="container">
          <div className="row">
            <div className="col-md-8" style={{ paddingTop: '12px' }}>
              <div className="logo">
                <a
                  href="#"
                  title="NIT Jalandhar"
                  rel="home"
                  onClick={(e) => {
                    e.preventDefault();
                    if (onNavigate) onNavigate(isPublic ? 'login' : 'dashboard');
                  }}
                >
                  <img src="https://v1.nitj.ac.in/erp/Images/logo.png" alt="NIT Jalandhar" />
                </a>
              </div>

              <div className="logo2">
                <a
                  href="#"
                  title="NIT Jalandhar"
                  rel="home"
                  onClick={(e) => {
                    e.preventDefault();
                    if (onNavigate) onNavigate(isPublic ? 'login' : 'dashboard');
                  }}
                >
                  <img src="https://v1.nitj.ac.in/erp/Images/logo2.png" alt="NIT Jalandhar" />
                </a>
                <br />
                <p style={{ width: '100%', fontFamily: 'Times New Roman', letterSpacing: '1px', fontSize: '22px', color: 'white', lineHeight: '30px', margin: '0' }}>
                  डॉ बी आर अम्बेडकर राष्ट्रीय प्रौद्योगिकी संस्थान, जालंधर
                  <br />
                  Dr B R Ambedkar National Institute of Technology, Jalandhar
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navbar */}
      <nav className="navbar navbar-inverse" style={{ border: 'none', margin: '0', borderRadius: '0' }}>
        <div className="container">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#mainNav">
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <a
              className="navbar-brand"
              href="#"
              style={{ color: '#F7DC6F', fontFamily: 'Trebuchet MS', fontSize: '22px', textDecoration: 'none' }}
              onClick={(e) => { e.preventDefault(); if (onNavigate) onNavigate(isPublic ? 'login' : 'dashboard'); }}
            >
              | VidyastraAI |
            </a>
          </div>

          {!isPublic && user && (
            <div className="collapse navbar-collapse" id="mainNav">
              <ul className="nav navbar-nav">
                <li>
                  <a href="#" style={{ color: '#ccc' }} onClick={(e) => { e.preventDefault(); onNavigate('dashboard'); }}>
                    <span className="glyphicon glyphicon-home" style={{ marginRight: '5px' }}></span> Dashboard
                  </a>
                </li>
                {(user.role === 'teacher' || user.role === 'student') && (
                  <li>
                    <a href="#" style={{ color: '#ccc' }} onClick={(e) => { e.preventDefault(); onNavigate('archive'); }}>
                      <span className="glyphicon glyphicon-film" style={{ marginRight: '5px' }}></span> Recorded Lectures
                    </a>
                  </li>
                )}
              </ul>
              <ul className="nav navbar-nav navbar-right">
                <li>
                  <a href="#" style={{ color: '#F7DC6F' }}>
                    <span className="glyphicon glyphicon-user" style={{ marginRight: '5px' }}></span>
                    {user.name}
                    <span className="label label-info" style={{ marginLeft: '8px', textTransform: 'capitalize', fontSize: '10px' }}>{user.role}</span>
                  </a>
                </li>
                <li>
                  <a href="#" style={{ color: '#ff6b6b' }} onClick={(e) => { e.preventDefault(); onLogout(); }}>
                    <span className="glyphicon glyphicon-log-out" style={{ marginRight: '5px' }}></span> Sign Out
                  </a>
                </li>
              </ul>
            </div>
          )}
        </div>
      </nav>

      {/* Page Content */}
      <div style={{ flex: '1' }}>
        {children}
      </div>

      {/* Footer */}
      <div className="container-fluid" style={{ backgroundColor: '#003A6A', width: '100%', padding: '0' }}>
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <p style={{ color: 'white', fontFamily: 'verdana', fontSize: '13px', textAlign: 'center', padding: '10px', margin: '0', lineHeight: '20px' }}>
                Copyright 2026 © VidyastraAI Learning System<br />
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ERPLayout;
