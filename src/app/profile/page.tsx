import Image from 'next/image'

function Buttomm() {
  return (
      <button style={{backgroundColor:"blue",border:"none",borderRadius:'4px',margin:"1rem",width:"20%",height:"3rem"}}>register</button>
  );
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <form action="/reregister" style={{display:"flex",flexDirection:"column",width:"60%",height:"300px"}}>
        <input type="text" style={{
          margin:"1rem",borderRadius:'10px',width:"100%",height:"70px",color:"black"
        }}/>
        <input type="text" style={{
          margin:"1rem",borderRadius:'10px',width:"100%",height:"70px",color:"black"
        }}/>
        <input type="text" style={{
          margin:"1rem",borderRadius:'10px',width:"100%",height:"70px",color:"black"
        }}/>
        <Buttomm />
      </form>
    </main>
  )
}
