import { useSearchParams } from "react-router"
const SearchResults = () => {
    const [searchParams] = useSearchParams();
    return (
        <div>
            {searchParams.get('q')}
        </div>
    )

}

export default SearchResults