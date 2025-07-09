import QueryForm from "./QueryForm"

const LookupPage = () => {
    const handleQuery = (queryParams) => {
        // Here you would implement the logic to query MongoDB using the queryParams
        console.log('Querying with:', queryParams);
        // Example: fetch data from your backend API
        // fetch('/api/employees', { method: 'POST', body: JSON.stringify(queryParams) })
        //   .then(response => response.json())
        //   .then(data => console.log(data));
      };

    return (
        <div>
            <h2>Lookup Page</h2>
            <p>Look up people's stuff (coming soon)</p>

            <QueryForm onQuery={handleQuery} />
        </div>
        )
}

export default LookupPage