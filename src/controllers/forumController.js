const { ForumTopic, ForumComment, User } = require("../models");

// 📌 Получение всех обсуждений
exports.getAllTopics = async (req, res) => {
  try {
    // 📌 Получаем все темы форума без пользователей
    const topics = await ForumTopic.findAll({
      order: [["createdAt", "DESC"]],
    });

    // 📌 Загружаем пользователей по userId отдельно
    const userIds = topics.map((topic) => topic.userId);
    const users = await User.findAll({
      where: { id: userIds },
      attributes: ["id", "name", "email"],
    });

    // 📌 Преобразуем массив пользователей в объект (id -> userData)
    const userMap = users.reduce((acc, user) => {
      acc[user.id] = user;
      return acc;
    }, {});

    // 📌 Добавляем данные пользователя в темы форума
    const topicsWithUsers = topics.map((topic) => ({
      ...topic.toJSON(),
      user: userMap[topic.userId] || null,
    }));

    res.json(topicsWithUsers);
  } catch (error) {
    console.error("❌ Ошибка при получении тем форума:", error);
    res.status(500).json({ message: "Ошибка сервера", error });
  }
};

// 📌 Создание новой темы
exports.createTopic = async (req, res) => {
  try {
    const { title, content } = req.body;

    const topic = await ForumTopic.create({
      title,
      content,
      userId: req.user.id,
    });

    res.status(201).json({ message: "Тема создана", topic });
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера", error });
  }
};

// 📌 Получение информации о теме
exports.getTopicById = async (req, res) => {
  try {
    const { id } = req.params;

    // 📌 Получаем тему без вложенных данных
    const topic = await ForumTopic.findByPk(id);

    if (!topic) {
      return res.status(404).json({ message: "Тема не найдена" });
    }

    // 📌 Загружаем автора темы
    const user = await User.findByPk(topic.userId, {
      attributes: ["id", "name", "email"],
    });

    // 📌 Загружаем все комментарии темы
    const comments = await ForumComment.findAll({
      where: { topicId: id },
      order: [["createdAt", "ASC"]], // 📌 Сортируем комментарии по времени
    });

    // 📌 Собираем `userId` всех комментаторов
    const userIds = [topic.userId, ...comments.map((c) => c.userId)];
    const users = await User.findAll({
      where: { id: userIds },
      attributes: ["id", "name", "email"],
    });

    // 📌 Преобразуем пользователей в объект (id -> userData)
    const userMap = users.reduce((acc, user) => {
      acc[user.id] = user;
      return acc;
    }, {});

    // 📌 Формируем список комментариев с данными автора
    const commentsWithUsers = comments.map((comment) => ({
      ...comment.toJSON(),
      user: userMap[comment.userId] || null,
    }));

    // 📌 Формируем итоговый объект темы
    const topicWithDetails = {
      ...topic.toJSON(),
      user: userMap[topic.userId] || null,
      comments: commentsWithUsers,
    };

    res.json(topicWithDetails);
  } catch (error) {
    console.error("❌ Ошибка при получении темы форума:", error);
    res.status(500).json({ message: "Ошибка сервера", error });
  }
};

// 📌 Добавление комментария
exports.addComment = async (req, res) => {
  try {
    const { content } = req.body;

    const topic = await ForumTopic.findByPk(req.params.id);
    if (!topic) {
      return res.status(404).json({ message: "Тема не найдена" });
    }

    const comment = await ForumComment.create({
      content,
      topicId: req.params.id,
      userId: req.user.id,
    });

    res.status(201).json({ message: "Комментарий добавлен", comment });
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера", error });
  }
};

exports.deleteForumTopic = async (req, res) => {
  try {
    const { id } = req.params;

    const topic = await ForumTopic.findByPk(id);
    if (!topic) {
      return res.status(404).json({ message: "Тема не найдена" });
    }

    await topic.destroy();
    res.json({ message: "Тема успешно удалена" });
  } catch (error) {
    console.error("❌ Ошибка при удалении темы форума:", error);
    res.status(500).json({ message: "Ошибка сервера", error });
  }
};

exports.deleteForumComment = async (req, res) => {
  try {
    const { id, commentId } = req.params;

    const comment = await ForumComment.findOne({ where: { id: commentId, topicId: id } });
    if (!comment) {
      return res.status(404).json({ message: "Комментарий не найден" });
    }

    await comment.destroy();
    res.json({ message: "Комментарий успешно удален" });
  } catch (error) {
    console.error("❌ Ошибка при удалении комментария:", error);
    res.status(500).json({ message: "Ошибка сервера", error });
  }
};
