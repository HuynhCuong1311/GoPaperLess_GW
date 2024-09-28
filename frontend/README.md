# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

const { data, isLoading, error } = useQuery({
queryKey: ["checkheader"],
queryFn: () => apiService.checkHeaderFooter(signing_token),
// queryFn: ({signal}) => apiService.checkHeaderFooter(signing_token, signal), dùng khi muốn cancel request
// refetchOnWindowFocus: false, // không refetch lại khi chuyển tab, đã set default
// keepPreviousData: false, // dùng khi phân trang nhằm cải thiện UX
// enabled: id !== undefined chỉ gọi api khi có giá trị id
});

// staleTime (default: 0 seconds): thời gian data được cho là đã cũ. Khi get data xong thì sau một thời gian quy định thì data sẽ tự cũ
// cacheTime (default: 5*60*1000 tức là 5 minutes): thời gian data sẽ bị xóa ra khỏi bộ nhớ đệm. Có thể data đã cũ nhưng nó chưa bị xóa ra khỏi bộ nhớ đêm vì được set staleTime < cacheTime. thường thì set staleTime < cacheTime
// inactive: là khi data đó không còn component nào subcribe, lúc này cacheTime sẽ bắt đầu được tính

// status (isLoading): thông tin 'data' có hay không
// fetchStatus (isFetching): thông tin về 'queryFn' có đang chạy hay không

// const queryClient = useQueryClient();

// useMutation({
// queryKey: ["checkheader"],
// mutationFn: () => apiService.checkHeaderFooter(signing_token), onSuccess: (data) => {
// queryClient.setQueryData(["checkheader",id], data); set lại Data, sử dụng khi cần dùng data xử lý tiếp
// queryClient.invalidateQueries({ queryKey: ["checkheader", id] }); refetch lại data
// }})

/\*\*

- Prefetching
- const handlePrefetch = async () => {
- await queryClient.prefetchQuery(["checkheader"],{
- queryFn: () => apiService.checkHeaderFooter(signing_token)
- staleTime: 10 \* 1000, 10s để không bị gọi api liên tục khi hover lại
- );
- };
  \*/

// onMouseEnter: dùng khi hover một component, tương tự như onClick, khi hover bên ngoài để prefetch thì cần set staleTime của component con để hạn chế việc bị gọi lại api khi click vào

/\*\*

- Cancel query
- const cancelQuery = () => {
- queryClient.cancelQueries({ queryKey: ["checkheader"] });
  }
  \*/
