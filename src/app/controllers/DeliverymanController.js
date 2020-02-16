import * as Yup from 'yup';
import Deliveryman from '../models/Deliveryman';
import File from '../models/File';

class DeliverymansController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().required()
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Validation Deliverymans fails store' });
    }

    const deliverymansExists = await Deliveryman.findOne({
      where: { name: req.body.name }
    });

    if (deliverymansExists) {
      return res.status(400).json({ error: 'Deliverymans already exists' });
    }

    const { id, name, email } = await Deliveryman.create(req.body);

    return res.json({
      id,
      name,
      email
    });
  }

  async update(req, res) {
    const deliveryman = await Deliveryman.findOne({
      where: { id: req.params.id }
    });
    // verfica se o id existe no banco de dados
    if (!deliveryman) {
      return res.status(400).json({ Error: 'Deliveryman ID does not exist!' });
    }

    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ Error: 'Validation fails!' });
    }

    const { email } = req.body;

    if (email && email === deliveryman.email) {
      return res.status(400).json({ Error: 'Email already exists!' });
    }

    const { id, name } = await deliveryman.update(req.body);

    return res.json({ id, name, email });
  }

  async delete(req, res) {
    const deliverymanExists = await Deliveryman.findByPk(req.params.id);

    if (!deliverymanExists) {
      return res.status(400).json({ error: 'Deliveryman not exists' });
    }

    await Deliveryman.destroy({ where: { id: req.params.id } });
    return res.status(200).json({});
  }

  async index(req, res) {
    const deliveryman = await Deliveryman.findAll({
      attributes: ['id', 'name', 'email', 'avatar_id'],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['name', 'path', 'url']
        }
      ]
    });
    return res.json(deliveryman);
  }
}

export default new DeliverymansController();