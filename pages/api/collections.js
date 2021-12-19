import { fetchCollections } from "../../utils/zora"

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const Route = async (req, res) => {
  const networkId = req.params.networkId;
  const collections = await fetchCollections(networkId)
  res.status(200).json({ collections })
}
export default Route
