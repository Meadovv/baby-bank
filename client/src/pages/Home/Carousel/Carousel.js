import { useEffect, useState, useRef } from 'react'
import './Carousel.css'

const images = [
    "/images/carousel/1.jpg",
    "/images/carousel/2.jpg",
    "/images/carousel/3.jpg"
]

const Carousel = () => {

    const [currentIndex, setCurrentIndex] = useState(0)
    const carouselRef = useRef()

    const handleNext = () => {
        setCurrentIndex(currentIndex => (currentIndex + 1) % (images.length))
    }


    useEffect(() => {
        setInterval(handleNext, 4500)
    }, [])

    return (
        <div className='carousel-container'>
            <div ref={carouselRef} className="carousel">
                <img className='carousel-image' src={images[currentIndex]} alt="carousel" />
            </div>
        </div>
    )
}

export default Carousel