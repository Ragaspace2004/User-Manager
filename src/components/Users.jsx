import useFetch from '../hooks/useFetch';

export default function Users(){
  const{data:user,loading,error}=useFetch({
    url:'https://server.ragapriya-k2022cse.workers.dev/api/user-table/2',
     });

return(
  <div>
  <h1 className="text-2xl font-sans font-medium mt-10">Users</h1>
<table className="border-4 p-5 mt-10">
  <thead className="bg-gray-300">
    <tr>
      <th className="border-2 px-3">ID</th>
      <th className="border-2 px-3">Name</th>
      <th className="border-2 px-3">Gender</th>
      <th className="border-2 p-3">City</th>
      <th className="border-2">Phone</th>
    </tr>
  </thead>
  <tbody className="border-2">
    {loading && <p>Loading companies...</p>}
    {error && <p>Error: {error}</p>}
    {user && user.map((u, index) => (
      <tr className="border-2" key={index}>
        <td className="border-2 px-10">{u.id}</td>
        <td className="border-2 px-5">{u.name}</td>
        <td className="border-2 px-5">{u.gender}</td>
        <td className="border-2 px-10">{u.city}</td>
        <td className="border-2 px-10">{u.phone_no}</td>
      </tr>
    ))}
  </tbody>
</table>
</div>
);
}