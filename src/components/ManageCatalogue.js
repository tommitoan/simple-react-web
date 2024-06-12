import { useEffect, useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";

const ManageCatalogue = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true); // Add loading state
    const { jwtToken } = useOutletContext();
    const navigate = useNavigate();

    useEffect(() => {
        let isMounted = true;

        const fetchMovies = async () => {
            if (!jwtToken) {
                setLoading(false); // Stop loading if token is not available
                return;
            }

            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            headers.append("Authorization", "Bearer " + jwtToken);

            const requestOptions = {
                method: "GET",
                headers: headers,
            };

            try {
                const response = await fetch(`/admin/movies`, requestOptions);
                const data = await response.json();
                if (isMounted) {
                    setMovies(data);
                    setLoading(false); // Stop loading after fetching movies
                }
            } catch (error) {
                console.log(error);
                setLoading(false); // Stop loading if an error occurs
                setTimeout(() => {
                    navigate("/login"); // Redirect to login page after a delay
                }, 3000); // Adjust the delay time as needed
            }
        };

        fetchMovies();

        return () => {
            isMounted = false; // Cleanup function to prevent memory leaks
        };
    }, [jwtToken, navigate]);

    if (loading) {
        return <div>Loading...</div>; // Render loading indicator while fetching data
    }

    return(
        <div>
            <h2>Manage Catalogue</h2>
            <hr />
            <table className="table table-striped table-hover">
                <thead>
                    <tr>
                        <th>Movie</th>
                        <th>Release Date</th>
                        <th>Rating</th>
                    </tr>
                </thead>
                <tbody>
                    {movies.map((m) => (
                        <tr key={m.id}>
                            <td>
                                <Link to={`/admin/movie/${m.id}`}>
                                    {m.title}
                                </Link>
                            </td>
                            <td>{m.release_date}</td>
                            <td>{m.mpaa_rating}</td>
                        </tr>    
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default ManageCatalogue;