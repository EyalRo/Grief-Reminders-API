// ./src/methods/cronTask.ts
// Provides methods triggered by CRON (timer, not api)

const cronTask = async (env: { DB?: any; SENDGRID_API_KEY: any; }) => {
  async function sendEmail(messageBody: any, env: { SENDGRID_API_KEY: any; }) {
    try {
      const email = await fetch("https://api.sendgrid.com/v3/mail/send", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.SENDGRID_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messageBody),
      });
      return email;
    } catch (error) {
      return { status: 500, statusText: error };
    }
  }

  // send email to account owner
  var { results } = await env.DB.prepare(
    "SELECT account_name, account_email, social_network_name, days_to_deactivate - round(julianday(current_timestamp) - julianday(last_update)) AS time_left FROM accounts JOIN social_network_accounts on accounts.uid = social_network_accounts.managing_user_account JOIN social_networks ON social_network_accounts.social_network = social_networks.rowid WHERE time_left IN (7,4,2) AND allow_email = TRUE"
  ).all();
  for (let result of results) {
    const messageBody = { "from": { "email": "death.in.digital.era@gmail.com" }, "personalizations": [{ "to": [{ "email": result.account_email }] }], "template_id": "d-729b00bca6b544c0bb451e1b41cbd8a9" }
    await sendEmail(messageBody, env)
  }
  /*
    // Send email to contacts
    var { results } = await env.DB.prepare(
      "SELECT contact_first_name, contact_email, account_email, account_name, social_network_name, days_to_deactivate - round(julianday(current_timestamp) - julianday(last_update)) AS time_left FROM contacts JOIN accounts ON contacts.managed_by_account = accounts.uid JOIN social_network_accounts on contacts.managed_by_account = social_network_accounts.managing_user_account JOIN social_networks ON social_network_accounts.social_network = social_networks.uid WHERE julianday(current_timestamp) - julianday(last_update) < 600 AND allow_email=TRUE"
    ).all();
    for (let result of results) {
      console.log(
        `Hi ${result.contact_email}, Your ${result.social_network_name} account ${result.account_name} will expire in ${result.time_left} days`
      );
    }
  */
};

export default cronTask
