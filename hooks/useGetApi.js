import { useState, useEffect } from 'react'
import axios from 'axios'

const useGetApi = ({ url, status }) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const fecthDb = async () => {
    try {
      setLoading(true)
      const response = await axios.get(url)
      if (response.data.success) {
        setData(response.data.data)
        console.log(response.data)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }
  const handleSetLoading = (prev) => {
    setLoading(prev)
  }

  useEffect(() => {
    fecthDb()
  }, [status])

  return {
    data,
    loading,
    handleSetLoading,
    setData,
  }
}
export default useGetApi
