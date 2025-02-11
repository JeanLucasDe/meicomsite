import { Link, NavLink, useOutletContext } from "react-router-dom"
import styles from "./HomeCardapio.module.css"
import {FaBars, FaCircle, FaHome, FaShoppingBag, FaShoppingCart} from "react-icons/fa"
import {App} from "../../../Hooks/App"
import '@firebase/firestore';
import { getFirestore, collection, getDocs} from "@firebase/firestore";
import { useState } from "react";
import BoxSubTotal from "./BoxSubTotal"
import {Swiper,SwiperSlide} from "swiper/react";
import { FreeMode, Scrollbar} from "swiper";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import 'swiper/css/navigation';
import DetalhesVenda from "../../../Formularios/Cliente/DetalhesVenda";




export default function HomeCardapio () {
    const [produtoss, usuario, funcionamento] = useOutletContext()
    var {serviços, razao, email, clientes, logo, site} = usuario.length > 0 && usuario[0]
    const [prod, setProd] = useState([])
    const [vendas, setVendas] = useState([])
    const [show, setShow] = useState(false)
    const [ok, setOk] = useState(false)

    const db = getFirestore(App)
    const ProdCollection = collection(db, `MeiComSite/${email}/produtos`)
    const VendasCollection = collection(db, `MeiComSite/${email}/vendas`)

    const getUsers = async () => {
        const dataProd = await getDocs(ProdCollection)
        const dataVendas = await getDocs(VendasCollection)
        setProd((dataProd.docs.map((doc) => ({...doc.data(), id: doc.id}))))
        setVendas((dataVendas.docs.map((doc) => ({...doc.data(), id: doc.id}))))
        setOk(true)
    }
    if (!ok) {
        getUsers()
    }

    const FormataValor = (valor) => {
        var valorFormatado = valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        return valorFormatado
    }
    function pegaCompraSave() {
        let produtosSalvos = new Array()
        if (localStorage.hasOwnProperty(`pedido.${site}`)) {
            produtosSalvos = JSON.parse(localStorage.getItem(`pedido.${site}`))
        }
        return produtosSalvos
    }
    const CompraSave = pegaCompraSave()

    const Compra = CompraSave && vendas.length > 0 && vendas.filter(dados => dados.identrega == CompraSave.identrega)

    if (Compra.length > 0 ) {
        Compra[0].state == 4 && localStorage.setItem(`pedido.${site}`,JSON.stringify({}))
    }

    return (
        <>
        {
            Compra.length>0 && Compra[0].state != 4 ? 
            <div>
                <div>
                    {Compra.length > 0 && Compra[0].state == 1 &&
                    <div
                    className={`${styles.state_1} ${styles.cont_stage}`}
                    >
                        <p>Pedido Recebido</p>
                        <div>
                            ID Entrega: <span className={styles.idEntrega}>{Compra[0].identrega}</span>
                        </div>
                    </div>}
                    {Compra.length > 0 && Compra[0].state == 2 &&
                    <div
                    className={`${styles.state_2} ${styles.cont_stage}`}
                    >
                        <p>Em Preparo</p>
                        <div>
                            ID Entrega: <span className={styles.idEntrega}>{Compra[0].identrega}</span>
                        </div>
                    </div>}
                    {Compra.length > 0 && Compra[0].state == 3 &&
                    <div
                    className={`${styles.state_3} ${styles.cont_stage}`}
                    >
                        <p>Saiu para Entrega</p>
                        <div>
                            ID Entrega: <span className={styles.idEntrega}>{Compra[0].identrega}</span>
                        </div>
                    </div>}
                </div>
                <div
                className={styles.contDetail}
                >
                    <DetalhesVenda obj={Compra.length > 0 && Compra[0]}/>
                </div>
            </div>

            :
            <div className={styles.container}>
            <div className={styles.top_header}/>
            <p>
                Site Criado pela 
                <Link to="/">MeiComSite</Link>
            </p>
            <input className={styles.input_main} type="text"
            placeholder="O que deseja pedir hoje?"
            />
            <div className={styles.shop}>
                <img src={logo}
                className={styles.logo}
                />
                <div className={styles.razao}>
                    <p className={styles.name_shop}> {razao}</p>
                    <p className={styles.status}><FaCircle className={styles.circle}/> Aberto Agora</p>
                </div>
            </div>
            <div className={styles.cont_nav_menu}>
                <Swiper
                slidesPerView={2}
                freeMode={true}
                modules={[FreeMode, Scrollbar]}
                scrollbar={{
                    hide: false,
                    }}
                >
                    {prod && prod.map(dados => {
                        if (dados.produtos.length > 0) {
                            return (
                                <SwiperSlide>
                                    <NavLink
                                    to={`/${site}/${dados.id}`}
                                    className={`${styles.link} ${({ isActive, isPending }) =>
                                        isPending ? styles.isPending : isActive ? styles.isActive : styles.isPending
                                    }`}>
                                            <p className={styles.name_categorie}>{dados.categoria}</p>
                                        
                                    </NavLink>
                                </SwiperSlide>
                                )
                        }
                    })}
                </Swiper>
            </div>
            <div className={styles.menu_options}>
                <ul className={styles.list_categories}>
                    {prod && prod.map(dados => {
                    if (dados.produtos.length > 0 ) {
                        return (
                            <>
                                <li className={styles.categorie}
                                key={dados.id}
                                >
                                
                                    <h5 className={styles.name_categorie}>{dados.categoria}</h5>
                                    <ul className={styles.list_itens}>
                                        {dados.produtos.map((item, index )=> {
                                            return (
                                                <li key={item.id}
                                                className={styles.item}
                                                >
                                                    <Link
                                                    to={`/${site}/${dados.id}/${index}`}
                                                    >
                                                        <div className="row">
                                                            <div className="col-6">
                                                                <p className={styles.name_item}>{item.nome}</p>
                                                                <p className={styles.preço_item}>{FormataValor(item.preço)}</p>
                                                            </div>
                                                            <div className="col-6">
                                                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIIrBbM185W0hlTKs928AOWCJkvmZT6gLGnA&usqp=CAU" className={styles.img}/>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                </li>
                                                )
                                        })}
                                    </ul>
                                </li>
                            </>
                        )  
                    }
                    })}
                </ul>
            </div>
            <BoxSubTotal show ={show} />
            
            <div className={styles.cont_bottom}>
                <FaBars/>
                <Link
                to={`/${site}`}
                ><FaHome/></Link>
                <FaShoppingCart id ="bag"
                className={styles.kart}
                onClick={() => {
                    setShow(!show)
                }}
                />
            </div>
        </div>}
        
        </>
        )
}