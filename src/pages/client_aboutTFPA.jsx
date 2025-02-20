import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/clientHeader.jsx";
import Footer from "../components/footer.jsx";
import wallpaper from "../assets/planner.jpg";
import tfpa_structure from "../assets/tfpa_structure.jpg";

export default function FinancialPlannerPage() {
  const [activeSection, setActiveSection] = useState("mission");

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow font-ibm">
        <Banner />
        <div className="container mx-auto flex flex-col md:flex-row py-12 px-4">
          <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
          <ContentSection activeSection={activeSection} />
        </div>
      </main>
      <Footer />
    </div>
  );
}

// Banner Section
const Banner = () => (
  <section
    className="relative bg-cover bg-center"
    style={{ backgroundImage: `url(${wallpaper})` }}
  >
    <div className="absolute inset-0 bg-tfpa_blue opacity-70"></div>
    <div className="relative z-10 max-w-6xl mx-auto px-4 py-10 text-white text-center">
      <h1 className="text-tfpa_gold text-4xl font-bold mb-4">เกี่ยวกับสมาคมนักวางแผนการเงิน</h1>
      <p className="text-xl">Thai Financial Planners Association</p>
    </div>
  </section>
);

// Sidebar Navigation
const Sidebar = ({ activeSection, setActiveSection }) => {
  const sections = [
    { id: "mission", title: "พันธกิจ" },
    { id: "history", title: "ประวัติสมาคม" },
    { id: "founders", title: "สมาชิกผู้ก่อตั้ง" },
    { id: "structure", title: "โครงสร้างสมาคม" }
  ];

  return (
    <nav className="w-full md:w-1/4 bg-gray-100 rounded-lg p-4 md:mr-6">
      <ul className="space-y-4">
        {sections.map((section) => (
          <li
            key={section.id}
            className={`cursor-pointer p-2 rounded-lg text-lg font-semibold ${
              activeSection === section.id ? "bg-tfpa_gold text-white" : "text-tfpa_blue hover:bg-gray-200"
            }`}
            onClick={() => setActiveSection(section.id)}
          >
            {section.title}
          </li>
        ))}
      </ul>
    </nav>
  );
};

// Content Section
const ContentSection = ({ activeSection }) => {
  const content = {
    mission: (
      <div>
        <h2 className="text-3xl font-bold text-tfpa_blue mb-4">พันธกิจ</h2>
        <p className="text-gray-700">
          - ส่งเสริมวิชาชีพนักวางแผนการเงิน CFP ให้เป็นที่รู้จักแพร่หลายในอุตสาหกรรมการเงินของไทย โดยผลิตนักวางแผนการเงิน CFPที่มีคุณภาพมีจรรยาบรรณในการประกอบวิชาชีพตามมาตรฐานสากล
          <br />
          <br />
          - สร้างมาตรฐานวิชาชีพการวางแผนการเงินที่เป็นเลิศ
        </p>
      </div>
    ),
    history: (
      <div>
        <h2 className="text-3xl font-bold text-tfpa_blue mb-4">ประวัติสมาคม</h2>
        <p className="text-gray-700">
          สมาคมนักวางแผนการเงินไทย (Thai Financial Planners Association – TFPA) เป็นองค์กรกำกับดูแลตนเองที่ไม่แสวงหากำไร จัดตั้งขึ้นตามพระราชบัญญัติสมาคม การค้า พ.ศ. 2509 เมื่อวันที่ 26 กันยายน พ.ศ. 2550 ซึ่งมีผู้ร่วมก่อตั้งทั้งในส่วนของ บุคคลและนิติบุคคล จำนวน 39 ราย ประกอบด้วย ธนาคารพาณิชย์ บริษัทประกัน ชีวิต บริษัทหลักทรัพย์ บริษัทหลักทรัพย์จัดการกองทุน กองทุนบำเหน็จบำนาญ ข้าราชการ และตลาดหลักทรัพย์แห่งประเทศไทย โดยเล็งเห็นประโยชน์ของบริการ วางแผนการเงินที่จะมีต่อประชาชนและอุตสากรรมการเงินของประเทศไทยเป็น
          สำคัญ
          <br />
          <br />
          ในปี 2550 สมาคมฯ ได้เข้าร่วมเป็นสมาชิกของ Financial Planning Standards Board Ltd. (FPSB) นับเป็นสมาชิกลำดับที่ 22 จากสมาชิกรวม 26 ประเทศทั่วโลก โดยมุ่งส่งเสริมให้ผู้ที่ได้รับคุณวุฒิวิชาชีพนักวางแผนการเงิน CFP และคุณวุฒิ วิชาชีพที่ปรึกษาการเงิน AFPT ซึ่งถือเป็นผู้ที่มีความรู้ ทักษะ ความสามารถ และมี จรรยาบรรณในการประกอบวิชาชีพได้รับการยอมรับและมีความน่าเชื่อถือในระดับสากล รวมทั้งเป็นที่รู้จักและยอมรับในอุตสาหกรรมการเงินของประเทศไทยอย่าง กว้างขวาง
          <br />
          <br />
          ในปี 2552 มีผู้ขึ้นทะเบียนคุณวุฒิวิชาชีพนักวางแผนการเงิน CFP กลุ่มแรก จำนวน 66 ราย และต่อมาในปี 2553 เริ่มมีผู้ขึ้นทะเบียนคุณวุฒิวิชาชีพที่ปรึกษา การเงิน AFPT ด้านการลงทุน และคุณวุฒิวิชาชีพที่ปรึกษาการเงิน AFPT ด้านประกัน ชีวิต และเพื่อการเกษียณ
        </p>
      </div>
    ),
    founders: (
      <div>
        <h2 className="text-3xl font-bold text-tfpa_blue mb-4">สมาชิกผู้ก่อตั้ง</h2>
        <p className="text-gray-700">
          - เครือธนาคารกรุงเทพ จำกัด (มหาชน)
          <br />
          - เครือธนาคารทิสโก้ จำกัด (มหาชน)
          <br />
          - เครือธนาคารธนชาต จำกัด (มหาชน)
          <br />
          - เครือธนาคารหลวงไทย จำกัด (มหาชน)
          <br />
          - เครือธนาคารไทยพาณิชย์ จำกัด (มหาชน)
          <br />
          - เครือธนาคารกสิกรไทย จำกัด (มหาชน)
          <br />
          - ธนาคารยูโอบี จำกัด (มหาชน)
          <br />
          - ธนาคารเอชเอสบีซี ประเทศไทย
          <br />
          - ธนาคารเกียรตินาคิน จำกัด (มหาชน)
          <br />
          - ธนาคารกรุงศรีอยุธยา จำกัด (มหาชน)
          <br />
          - ธนาคารสแตนดาร์ดชาร์เตอร์ด (ไทย) จำกัด (มหาชน)
          <br />
          - บริษัทหลักทรัพย์ ดีบีเอส วิคเคอร์ส (ประเทศไทย) จำกัด
          <br />
          - บริษัทหลักทรัพย์ ภัทร จำกัด (มหาชน)
          <br />
          - บริษัทหลักทรัพย์ สินเอเซีย จำกัด
          <br />
          - บริษัทหลักทรัพย์จัดการกองทุน กรุงไทย จำกัด (มหาชน)
          <br />
          - บริษัทหลักทรัพย์จัดการกองทุน ทหารไทย จำกัด
          <br />
          - บริษัทหลักทรัพย์จัดการกองทุน ฟินันซ่า จำกัด
          <br />
          - บริษัทหลักทรัพย์จัดการกองทุนรวม วรรณ จำกัด
          <br />
          - บริษัทหลักทรัพย์จัดการกองทุน แอสเซท พลัส จำกัด
          <br />
          - บริษัทหลักทรัพย์จัดการกองทุน ไอเอ็นจี (ประเทศไทย) จำกัด
          <br />
          - บริษัท กรุงเทพประกันชีวิต จำกัด (มหาชน)
          <br />
          - บริษัท ไทยประกันชีวิต จำกัด (มหาชน)
          <br />
          - บริษัท ไทยสมุทรประกันชีวิต จำกัด (มหาชน)
          <br />
          - บริษัท เมืองไทยประกันชีวิต จำกัด (มหาชน)
          <br />
          - บริษัท อเมริกันอินเตอร์แนชชั่นแนล แอสชัวรันส์ จำกัด
          <br />
          - กองทุนบำเหน็จบำนาญข้าราชการ
          <br />
          - ตลาดหลักทรัพย์แห่งประเทศไทย
        </p>
      </div>
    ),
    structure: (
      <div>
        <h2 className="text-3xl font-bold text-tfpa_blue mb-4">โครงสร้างสมาคม</h2>
        <img src={tfpa_structure} alt="โครงสร้างสมาคม" className="w-full h-auto rounded-lg shadow-md" />
      </div>
    )
  };

  return <div className="w-full md:w-3/4 p-6 bg-white rounded-lg shadow-md">{content[activeSection]}</div>;
};

