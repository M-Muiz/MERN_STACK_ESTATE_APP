import LoadingBar from 'react-top-loading-bar'

const TopLoadingBar = (percent) => {
  return (
    <div>
      <LoadingBar
        color='#1b264c'
        height="6px"
        progress={percent.progress}
      />
      <br />
    </div>
  )
}


export default TopLoadingBar;
