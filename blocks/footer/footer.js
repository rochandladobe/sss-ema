export default async function decorate(block) {
  const resp = await fetch('/footer.plain.html');

  if (!resp.ok) {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
      <div>
        <p><img src="https://www.sss.gov/wp-content/themes/sss/assets/visuals/css-assets/sss-logo.svg" alt="Selective Service System Logo"></p>
        <h3>SELECTIVE SERVICE SYSTEM</h3>
        <p>Call: <a href="tel:847-688-6888">847-688-6888</a> or toll-free: <a href="tel:888-655-1825">888-655-1825</a></p>
        <p>Hours of operation: 9:00 AM to 5:00 PM EST, Monday to Friday, except on federal holidays.</p>
      </div>
      <div>
        <div class="columns"><div>
          <div>
            <h4>Reports</h4>
            <ul>
              <li><a href="/foia">FOIA (Freedom of Information Act)</a></li>
              <li><a href="/reports/annual-reports-to-congress">Annual Reports</a></li>
              <li><a href="/reports">Budget and Performance</a></li>
              <li><a href="/data">Data</a></li>
              <li><a href="/eeo">EEO Resources</a></li>
              <li><a href="/reports/quality-of-information">Quality of Information</a></li>
              <li><a href="/inspector-general">Inspector General</a></li>
            </ul>
          </div>
          <div>
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/careers">Careers and Internships</a></li>
              <li><a href="/accessibility">Accessibility</a></li>
              <li><a href="/privacy">Privacy Policy</a></li>
              <li><a href="/terms-of-use">Terms of Use</a></li>
              <li><a href="https://www.usa.gov/">USA.gov</a></li>
              <li><a href="/selective-service-employees">Employees</a></li>
              <li><a href="/vulnerability-disclosure-policy">Vulnerability Disclosure</a></li>
              <li><a href="https://www.todaysmilitary.com/">Today's Military</a></li>
              <li><a href="https://osc.gov/">U.S. Office of Special Counsel</a></li>
            </ul>
          </div>
          <div>
            <h4>Get In Touch</h4>
            <ul>
              <li><a href="mailto:information@sss.gov">Email</a></li>
              <li><a href="https://www.linkedin.com/company/selective-service-system/">LinkedIn</a></li>
            </ul>
          </div>
        </div></div>
      </div>`;
    block.append(...wrapper.children);
    return;
  }

  const html = await resp.text();
  const temp = document.createElement('div');
  temp.innerHTML = html;
  block.append(...temp.children);
}
