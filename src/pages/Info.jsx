import { useState } from 'react'
import { useStore } from '../context/Store'

const Page = ({ title, children }) => <div className="container-x max-w-3xl space-y-4 py-12"><h1 className="text-5xl">{title}</h1>{children}</div>
export const Delivery = () => <Page title="Delivery"><p>Standard delivery takes 3–6 working days and costs $6, free over $80. Express takes 1–2 days and costs $14. You will get a call or message to confirm your order.</p></Page>
export const Returns = () => <Page title="Returns"><p>Return unworn, unwashed items with tags within 14 days of delivery. Contact us with your order number and we will arrange the return. Refunds are issued within 7 days of receiving the parcel.</p></Page>
export const Privacy = () => <Page title="Privacy policy"><p>We collect only what is needed to process your order: name, contact details and address. We never store card details. Replace this text with your legally reviewed policy before launch.</p></Page>
export function SizeGuide() {
  const rows = [['XS', '32–33', '24–25', '34–35'], ['S', '34–35', '26–27', '36–37'], ['M', '36–37', '28–29', '38–39'], ['L', '38–40', '30–32', '40–42'], ['XL', '41–43', '33–35', '43–45'], ['XXL', '44–46', '36–38', '46–48'], ['1X', '47–49', '39–41', '49–51'], ['2X', '50–52', '42–44', '52–54'], ['3X', '53–55', '45–47', '55–57']]
  return <Page title="Size guide"><p>Body measurements in inches. Between sizes? Choose the larger one.</p>
    <div className="overflow-x-auto"><table className="w-full text-left text-sm"><caption className="sr-only">Size chart</caption><thead><tr className="border-b border-sand">{['Size', 'Bust', 'Waist', 'Hips'].map((h) => <th key={h} className="py-2">{h}</th>)}</tr></thead><tbody>{rows.map((r) => <tr key={r[0]} className="border-b border-sand/60">{r.map((c, i) => <td key={i} className="py-2">{c}</td>)}</tr>)}</tbody></table></div></Page>
}
export function FAQ() {
  const qs = [['How long does delivery take?', 'Standard is 3–6 days, express 1–2 days.'], ['Can I pay on delivery?', 'Yes, cash on delivery is available.'], ['How do I care for satin?', 'Wash cold on a gentle cycle and line dry.'], ['Can I return a gift?', 'Yes, within 14 days if unworn and tagged.']]
  return <Page title="Frequently asked questions">{qs.map(([q, a]) => <details key={q} className="rounded-2xl bg-ivory p-4"><summary className="cursor-pointer font-medium">{q}</summary><p className="mt-2 text-sm text-mocha">{a}</p></details>)}</Page>
}
export function Contact() {
  const { notify } = useStore(); const [f, setF] = useState({ name: '', email: '', msg: '' }); const [e, setE] = useState({})
  const submit = (ev) => {
    ev.preventDefault(); const er = {}
    if (f.name.trim().length < 2) er.name = 'Enter your name.'
    if (!/^\S+@\S+\.\S+$/.test(f.email)) er.email = 'Enter a valid email address.'
    if (f.msg.trim().length < 10) er.msg = 'Write at least 10 characters.'
    setE(er); if (!Object.keys(er).length) { notify('Message sent. We will reply soon.'); setF({ name: '', email: '', msg: '' }) } // TODO: POST to backend
  }
  return <Page title="Contact us"><form onSubmit={submit} noValidate className="space-y-3">
    {[['name', 'Name'], ['email', 'Email']].map(([k, l]) => <div key={k}><label className="label" htmlFor={'c' + k}>{l}</label><input id={'c' + k} className="input" value={f[k]} onChange={(ev) => setF({ ...f, [k]: ev.target.value })} />{e[k] && <p className="err">{e[k]}</p>}</div>)}
    <div><label className="label" htmlFor="cm">Message</label><textarea id="cm" rows="5" className="input" value={f.msg} onChange={(ev) => setF({ ...f, msg: ev.target.value })} />{e.msg && <p className="err">{e.msg}</p>}</div>
    <button className="btn-primary">Send message</button></form></Page>
}
