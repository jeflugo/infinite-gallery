import { useState, useEffect, useRef } from 'react'

const UNSPLASH_ROOT = 'https://api.unsplash.com'

const App = () => {
	const [items, setItems] = useState([])
	const [isLoading, setIsLoading] = useState(false)
	const observerTarget = useRef(null)

	const fetchData = async () => {
		setIsLoading(true)

		fetch(
			`${UNSPLASH_ROOT}/photos/random?client_id=${import.meta.env.VITE_API_KEY}&count=10`,
		)
			.then(res => res.json())
			.then(data => {
				const imgs = data.map(item => item.urls.regular)
				setItems(prevItems => [...prevItems, ...imgs])
				setIsLoading(false)
			})
	}

	useEffect(() => {
		const observer = new IntersectionObserver(
			entries => {
				if (entries[0].isIntersecting) {
					fetchData()
				}
			},
			{ threshold: 1 },
		)

		if (observerTarget.current) {
			observer.observe(observerTarget.current)
		}

		return () => {
			if (observerTarget.current) {
				observer.unobserve(observerTarget.current)
			}
		}
	}, [observerTarget])

	return (
		<div className=' mx-auto flex w-[500px] flex-col items-center'>
			<h1 className='mb-6 text-4xl'>Infinite gallery</h1>
			<ul className='flex flex-wrap gap-4'>
				{items.map((item, i) => (
					<li key={i} className='w-60'>
						<img src={item} />
					</li>
				))}
			</ul>
			<div
				ref={observerTarget}
				className='flex h-[100px] items-center justify-center'
			>
				{isLoading && <p>Loading...</p>}
			</div>
		</div>
	)
}

export default App
