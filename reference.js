const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/education', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Schema
const contentSchema = new mongoose.Schema({
  links: [{
    text: String,
    href: String,
    isList: Boolean,
    subLinks: [{
      text: String,
      href: String
    }]
  }]
});

const Content = mongoose.model('Content', contentSchema);

// Initialize content if none exists
async function initializeContent() {
  const count = await Content.countDocuments();
  if (count === 0) {
    const initialContent = {
      links: [
        {
          text: 'Основные сведения',
          href: '/our-colleage/basic-information',
          isList: false
        },
        {
          text: 'Структура и органы управления образовательной организацией',
          href: '/our-colleage/structure',
          isList: false
        },
        {
          text: 'Документы',
          href: '/',
          isList: true,
          subLinks: [
            { text: 'Устав образовательной организации', href: 'https://simfpolyteh.ru/api/uploads/1713264198801.pdf' },
            { text: 'Правила внутреннего распорядка обучающихся', href: 'https://simfpolyteh.ru/api/uploads/1713265738394.pdf' },
            { text: 'Правила внутреннего трудового распорядка', href: '/our-colleage/labor-regulations' },
            { text: 'Коллективный договор', href: 'https://simfpolyteh.ru/our-colleage/collectiv-dogovor' },
            { text: 'Локальные нормативные акты образовательной организации по основным вопросам организации и осуществления образовательной деятельности', href: '/our-colleage/local-act' },
            { text: 'Отчет о результатах самообследования', href: '/our-colleage/self-examination-report' },
            { text: 'Предписания органов, осуществляющих контроль (надзор) в сфере образования', href: '/our-colleage/authority-regulations' }
          ]
        },
        {
          text: 'Образование',
          href: '/',
          isList: true,
          subLinks: [
            { text: 'Реализуемые образовательные программы с указанием учебных предметов, курсов, дисциплин (модулей), практик', href: '/relazie-programmers' },
            { text: 'Описание образовательных программ', href: '/our-colleage/desc-programs' },
            { text: 'Направление и результаты (научно-исследовательской) деятельности', href: '/our-colleage/ways-and-results-sience' },
            { text: 'Численность обучающихся по реализуемым образовательным программам за счет бюджетных ассигнований и по договорам об образовании за счет средств физических и (или) юридических лиц', href: '/our-colleage/count-sdudents-programm' },
            { text: 'Численность обучающихся, являющихся иностранными гражданами, по каждой специальности, направлению подготовки, укрупненной группы специальности', href: '/our-colleage/count--sdunents-outer' },
            { text: 'Языки образования', href: '/language_obrazovanie' },
            { text: 'Результаты приема по каждой специальности СПО', href: '/our-colleage/svedenya-about-results-spo' },
            { text: 'Трудоустройство выпускников в виде численности трудоустроенных выпускников прошлого учебного года, освоивших ОПОП СПО по каждой специальности', href: '/our-colleage/trudoistvo-gradualades' },
            { text: 'Учебно-методические объединения', href: '/our-colleage/union' }
          ]
        },
        {
          text: 'Руководство',
          href: '/',
          isList: true,
          subLinks: [
            { text: 'Руководство', href: '/our-colleage/management' }
          ]
        },
        {
          text: 'Педагогический состав',
          href: '/',
          isList: true,
          subLinks: [
            { text: 'Педагогический состав', href: 'https://simfpolyteh.ru/api/uploads/1728466191918.pdf' }
          ]
        },
        {
          text: 'Материально-техническое обеспечение и оснащённость образовательного процесса. Доступная среда',
          href: '/our-colleage/logistics',
          isList: false
        },
        {
          text: 'Платные образовательные услуги',
          href: '/our-colleage/paid',
          isList: true,
          subLinks: [
            { text: 'Порядок оказания платных образовательных услуг', href: '/our-colleage/poryadok-okazania-yslyg' },
            { text: 'Образец договора об оказании платных образовательных услуг', href: '/our-colleage/obrazez-dogovora' },
            { text: 'Об утверждении стоимости обучения по каждой образовательной программе', href: '/our-colleage/utverjdenie-stoimosti-obuchenia' },
            { text: 'Установление размера платы, взимаемой с родителей (законных представителей) за присмотр и уход за детьми', href: '/our-colleage/ystanovlenie-razmera-platy' }
          ]
        },
        {
          text: 'Финансово-хозяйственная деятельность',
          href: '/our-colleage/financial-economic',
          isList: true,
          subLinks: [
            { text: 'Об объеме образовательной деятельности, финансовое обеспечение которой осуществляется за счет бюджетных ассигнований и по договрам об оказании платных образовательных услуг', href: '/our-colleage/obem-obrazovat-deyatelnosti' },
            { text: 'О поступлении финансовых и материальных средств по итогам финансового года', href: '/our-colleage/postuplenie-finansovyh-sredstv' },
            { text: 'О расходовании финансовых и материальных средств по итогам финансового года', href: '/our-colleage/rashodovanie-finansovyh-sredstv' },
            { text: 'План финансово-хозяйственной деятельности (или бюджетная смета образовательной организации)', href: '/our-colleage/plan-finansovo-hoz-deyat' },
            { text: 'Разное', href: '/our-colleage/ostanlnoe-fin-hoz' }
          ]
        },
        {
          text: 'Вакантные места для приёма (перевода) обучающихся',
          href: '/our-colleage/vacancies',
          isList: false
        },
        {
          text: 'Стипендии и меры поддержки обучающихся',
          href: '/',
          isList: true,
          subLinks: [
            { text: 'О наличии и условиях предоставления обучающимся стипендий', href: '/our-colleage/scholarship' },
            { text: 'О наличии и условиях предоставления обучающимся мер социальной поддержки', href: '/our-colleage/social-support' },
            { text: 'О наличии общежития', href: '/our-colleage/availability-hostel' },
            { text: 'О количестве жилых помещений в общежитии для иногородних обучающихся', href: '/our-colleage/dormitory-rooms-count' },
            { text: 'О формировании платы за проживание в общежитии', href: '/our-colleage/dormitory-pay' }
          ]
        },
        {
          text: 'Международное сотрудничество',
          href: '/our-colleage/international',
          isList: false
        },
        {
          text: 'Организация питания в образовательной организации',
          href: '/nutrition',
          isList: true,
          subLinks: [
            { text: 'Условия питания и охраны здоровья обучающихся', href: '/our-colleage/yslovia-pitania-ohrany-zd' },
            { text: 'Условия питания обучающихся по образовательным программам начального общего образования', href: 'https://simfpolyteh.ru/our-colleage/yslovia-pitania' }
          ]
        },
        {
          text: 'Образовательные стандарты и требования',
          href: '/',
          isList: true,
          subLinks: [
            { text: 'Федеральные государственные образовательные стандарты', href: '/our-colleage/education-standarts' }
          ]
        }
      ]
    };
    await Content.create(initialContent);
  }
}

initializeContent();

// Get content
app.get('/api/content', async (req, res) => {
  try {
    const content = await Content.findOne();
    if (!content) return res.status(404).json({ error: 'Content not found' });
    res.json(content);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch content' });
  }
});

// Update entire content
app.put('/api/content', async (req, res) => {
  try {
    const newContent = req.body;
    if (!newContent.links) return res.status(400).json({ error: 'Invalid content structure' });
    const content = await Content.findOneAndUpdate({}, newContent, { new: true, upsert: true });
    res.json({ message: 'Content updated successfully', content });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update content' });
  }
});

// Add new link
app.post('/api/links', async (req, res) => {
  try {
    const { text, href, isList, subLinks } = req.body;
    if (!text || !href) return res.status(400).json({ error: 'Text and href are required' });
    const content = await Content.findOne();
    if (!content) return res.status(404).json({ error: 'Content not found' });
    content.links.push({ text, href, isList: !!isList, subLinks: subLinks || [] });
    await content.save();
    res.json({ message: 'Link added successfully', content });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add link' });
  }
});

// Delete link
app.delete('/api/links/:index', async (req, res) => {
  try {
    const index = parseInt(req.params.index);
    const content = await Content.findOne();
    if (!content) return res.status(404).json({ error: 'Content not found' });
    if (index < 0 || index >= content.links.length) return res.status(400).json({ error: 'Invalid link index' });
    content.links.splice(index, 1);
    await content.save();
    res.json({ message: 'Link deleted successfully', content });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete link' });
  }
});

// Add new sub-link
app.post('/api/links/:index/sublinks', async (req, res) => {
  try {
    const index = parseInt(req.params.index);
    const { text, href } = req.body;
    if (!text || !href) return res.status(400).json({ error: 'Text and href are required' });
    const content = await Content.findOne();
    if (!content) return res.status(404).json({ error: 'Content not found' });
    if (index < 0 || index >= content.links.length || !content.links[index].isList) {
      return res.status(400).json({ error: 'Invalid link index or link is not a list' });
    }
    content.links[index].subLinks.push({ text, href });
    await content.save();
    res.json({ message: 'Sub-link added successfully', content });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add sub-link' });
  }
});

// Delete sub-link
app.delete('/api/links/:index/sublinks/:subIndex', async (req, res) => {
  try {
    const index = parseInt(req.params.index);
    const subIndex = parseInt(req.params.subIndex);
    const content = await Content.findOne();
    if (!content) return res.status(404).json({ error: 'Content not found' });
    if (index < 0 || index >= content.links.length || !content.links[index].isList) {
      return res.status(400).json({ error: 'Invalid link index or link is not a list' });
    }
    if (subIndex < 0 || subIndex >= content.links[index].subLinks.length) {
      return res.status(400).json({ error: 'Invalid sub-link index' });
    }
    content.links[index].subLinks.splice(subIndex, 1);
    await content.save();
    res.json({ message: 'Sub-link deleted successfully', content });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete sub-link' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});