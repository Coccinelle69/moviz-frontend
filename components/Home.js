import { useState, useEffect } from "react";
import { Popover, Button } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";

import Movie from "./Movie";
import "antd/dist/antd.css";
import styles from "../styles/Home.module.css";

function Home() {
  const [likedMovies, setLikedMovies] = useState([]);
  const [fetchedMovies, setFetchedMovies] = useState([]);

  // Liked movies (inverse data flow)

  console.log(fetchedMovies);

  // useEffect(() => {
  //   const fetchMovies = async () => {
  //     try {
  //       const response = await fetch("http://localhost:3000/movies");
  //       if (!response.ok) {
  //         throw new Error("Failed to fetch movies");
  //       }
  //       const responseData = await response.json();
  //       setFetchedMovies(responseData.movies);
  //       // console.log(fetchedMovies);
  //     } catch (error) {
  //       console.error("Error fetching movies:", error);
  //     }
  //   };

  //   fetchMovies();
  // }, []);

  useEffect(() => {
    fetch("http://localhost:3000/movies")
      .then((response) => response.json())
      .then((data) => {
        setFetchedMovies(data.movies);
      });
  }, []);

  // let newMoviz = [];
  // newMoviz = fetchedMovies.map((movie) => {
  //   const poster = `https://image.tmdb.org/t/p/w500/${movie.poster_path}`;
  //   let overview = movie.overview;
  //   if (overview.length > 250) {
  //     overview = overview.substring(0, 250) + "...";
  //   }

  //   return {
  //     title: movie.title,
  //     poster,
  //     voteAverage: movie.vote_average,
  //     voteCount: movie.vote_count,
  //     overview,
  //   };
  // });

  const updateLikedMovies = (movieTitle) => {
    if (likedMovies.find((movie) => movie === movieTitle)) {
      setLikedMovies(likedMovies.filter((movie) => movie !== movieTitle));
    } else {
      setLikedMovies([...likedMovies, movieTitle]);
    }
  };

  const likedMoviesPopover = likedMovies.map((movieTitle, i) => {
    return (
      <div key={i} className={styles.likedMoviesContainer}>
        <span className="likedMovie">{movieTitle}</span>
        <FontAwesomeIcon
          icon={faCircleXmark}
          onClick={() => updateLikedMovies(movieTitle)}
          className={styles.crossIcon}
        />
      </div>
    );
  });

  const popoverContent = (
    <div className={styles.popoverContent}>{likedMoviesPopover}</div>
  );

  const movies = fetchedMovies.map((fetchedMovie, i) => {
    const isLiked = likedMovies.some((movie) => movie === fetchedMovie.title);
    let overview = fetchedMovie.overview;
    if (overview.length > 250) {
      overview = overview.substring(0, 250) + "...";
    }
    return (
      <Movie
        key={fetchedMovie.id}
        updateLikedMovies={updateLikedMovies}
        isLiked={isLiked}
        title={fetchedMovie.title}
        overview={fetchedMovie.overview}
        poster={`https://image.tmdb.org/t/p/w500/${fetchedMovie.poster_path}`}
        voteAverage={fetchedMovie.vote_average}
        voteCount={fetchedMovie.vote_count}
      />
    );
  });

  return (
    <div className={styles.main}>
      <div className={styles.header}>
        <div className={styles.logocontainer}>
          <img src="logo.png" alt="Logo" />
          <img className={styles.logo} src="logoletter.png" alt="Letter logo" />
        </div>
        <Popover
          title="Liked movies"
          content={popoverContent}
          className={styles.popover}
          trigger="click"
        >
          <Button>♥ {likedMovies.length} movie(s)</Button>
        </Popover>
      </div>
      <div className={styles.title}>LAST RELEASES</div>
      <div className={styles.moviesContainer}>{movies}</div>
    </div>
  );
}

export default Home;
