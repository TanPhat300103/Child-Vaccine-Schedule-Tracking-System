export default function AdminDashboard(){
    return (
        <>
  <meta charSet="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Admin Dashboard</title>
  <link
    href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
    rel="stylesheet"
  />
  <style
    dangerouslySetInnerHTML={{
      __html:
        "\n        body { display: flex; flex-direction: column; min-height: 100vh; }\n        .sidebar { width: 250px; height: 100vh; background: #343a40; color: white; padding: 15px; position: fixed; }\n        .sidebar a { color: white; text-decoration: none; display: block; padding: 10px; }\n        .sidebar a:hover { background: #495057; }\n        .content { margin-left: 250px; flex-grow: 1; padding: 20px; }\n        .footer { background: #f8f9fa; text-align: center; padding: 10px; margin-top: auto; }\n    "
    }}
  />
  <div className="sidebar">
    <h2>Admin Panel</h2>
    <a href="#">Dashboard</a>
    <a href="#">Users</a>
    <a href="#">Reports</a>
    <a href="#">Settings</a>
  </div>
  <div className="content">
    <nav className="navbar navbar-light bg-light mb-3">
      <span className="navbar-brand mb-0 h1">Dashboard</span>
    </nav>
    <div className="row">
      <div className="col-md-4">
        <div className="card text-white bg-primary mb-3">
          <div className="card-body">
            <h5 className="card-title">Total Users</h5>
            <p className="card-text">1,250</p>
          </div>
        </div>
      </div>
      <div className="col-md-4">
        <div className="card text-white bg-success mb-3">
          <div className="card-body">
            <h5 className="card-title">Active Users</h5>
            <p className="card-text">890</p>
          </div>
        </div>
      </div>
      <div className="col-md-4">
        <div className="card text-white bg-danger mb-3">
          <div className="card-body">
            <h5 className="card-title">Pending Reports</h5>
            <p className="card-text">42</p>
          </div>
        </div>
      </div>
    </div>
    <div className="row">
      <div className="col-md-12">
        <h3>Reports</h3>
        <p>Summary of reports and analytics will be displayed here.</p>
      </div>
    </div>
  </div>
  <footer className="footer">
    <p>© 2025 Admin Dashboard. All rights reserved.</p>
  </footer>
</>

    )
}