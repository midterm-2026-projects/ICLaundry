export default function CustomerTable({
  customers = [],
}) {
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Phone</th>
          <th>Email</th>
          <th>Added Date</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {customers.map((customer) => (
          <tr key={customer.id}>
            <td>
              {customer.fullName}
            </td>

            <td>
              {customer.phone}
            </td>

            <td>
              {customer.email}
            </td>

            <td>
              {customer.addedDate}
            </td>

            <td>
              Actions
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}