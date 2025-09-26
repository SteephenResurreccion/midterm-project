import Form from 'react-bootstrap/Form'


export default function SearchBar({ query, setQuery }) {
return (
<Form className="mb-3">
<Form.Control
type="search"
placeholder="Search by name or location…"
value={query}
onChange={(e) => setQuery(e.target.value)}
/>
</Form>
)
}